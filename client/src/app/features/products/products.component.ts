import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { getApiErrorMessage } from "../../core/services/fetch-api";
import { ProductCategoryService } from "../../core/services/product-category.service";
import { ProductService } from "../../core/services/product.service";
import { ProductCategory } from "../../shared/models/product-category.model";
import { Product, ProductInput } from "../../shared/models/product.model";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.css"
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoryService = inject(ProductCategoryService);
  private readonly productService = inject(ProductService);

  private productsController: AbortController | null = null;
  private categoriesController: AbortController | null = null;
  private descriptionController: AbortController | null = null;

  readonly products = signal<Product[]>([]);
  readonly categories = signal<ProductCategory[]>([]);
  readonly selectedCategoryId = signal("");
  readonly editingId = signal<string | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal("");
  readonly descriptionVisible = signal(false);
  readonly generatingDescription = signal(false);
  readonly productCount = computed(() => this.products().length);
  readonly hasCategories = computed(() => this.categories().length > 0);

  readonly form = this.formBuilder.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    sku: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    productCategoryId: ["", Validators.required],
    description: ["", Validators.maxLength(1000)],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    minimumStock: [0, [Validators.required, Validators.min(0)]],
    expirationDate: [""],
    active: [true]
  });

  ngOnInit(): void {
    void this.loadCategories();
    void this.loadProducts();
  }

  ngOnDestroy(): void {
    this.productsController?.abort();
    this.categoriesController?.abort();
    this.descriptionController?.abort();
  }

  async loadCategories(): Promise<void> {
    this.categoriesController?.abort();
    this.categoriesController = new AbortController();

    try {
      const response = await this.categoryService.list(this.categoriesController.signal);
      this.categories.set(response.data ?? []);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        this.errorMessage.set(
          getApiErrorMessage(error, "Could not load product categories.")
        );
      }
    }
  }

  async loadProducts(): Promise<void> {
    this.productsController?.abort();
    this.productsController = new AbortController();
    this.loading.set(true);
    this.errorMessage.set("");

    try {
      const response = await this.productService.list(
        this.selectedCategoryId() || undefined,
        this.productsController.signal
      );
      this.products.set(response.data ?? []);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        this.errorMessage.set(getApiErrorMessage(error, "Could not load products."));
      }
    } finally {
      this.loading.set(false);
    }
  }

  filterByCategory(event: Event): void {
    this.selectedCategoryId.set((event.target as HTMLSelectElement).value);
    void this.loadProducts();
  }

  edit(product: Product): void {
    const categoryId =
      typeof product.productCategoryId === "string"
        ? product.productCategoryId
        : product.productCategoryId._id;

    this.editingId.set(product._id);
    this.descriptionVisible.set(Boolean(product.description));
    this.form.setValue({
      name: product.name,
      sku: product.sku,
      productCategoryId: categoryId,
      description: product.description ?? "",
      unitPrice: product.unitPrice,
      stockQuantity: product.stockQuantity,
      minimumStock: product.minimumStock,
      expirationDate: product.expirationDate?.slice(0, 10) ?? "",
      active: product.active
    });
  }

  cancelEdit(): void {
    this.descriptionController?.abort();
    this.editingId.set(null);
    this.descriptionVisible.set(false);
    this.generatingDescription.set(false);
    this.form.reset({
      name: "",
      sku: "",
      productCategoryId: "",
      description: "",
      unitPrice: 0,
      stockQuantity: 0,
      minimumStock: 0,
      expirationDate: "",
      active: true
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set("");
    const raw = this.form.getRawValue();
    const input: ProductInput = {
      name: raw.name,
      sku: raw.sku.toUpperCase(),
      productCategoryId: raw.productCategoryId,
      description: raw.description || undefined,
      unitPrice: Number(raw.unitPrice),
      stockQuantity: Number(raw.stockQuantity),
      minimumStock: Number(raw.minimumStock),
      expirationDate: raw.expirationDate || undefined,
      active: raw.active
    };
    const editingId = this.editingId();

    try {
      if (editingId) {
        await this.productService.update(editingId, input);
      } else {
        await this.productService.create(input);
      }

      this.cancelEdit();
      await this.loadProducts();
    } catch (error) {
      this.errorMessage.set(getApiErrorMessage(error, "Could not save the product."));
    } finally {
      this.saving.set(false);
    }
  }

  async generateDescription(): Promise<void> {
    const nameControl = this.form.controls.name;
    const categoryControl = this.form.controls.productCategoryId;

    if (nameControl.invalid || categoryControl.invalid) {
      nameControl.markAsTouched();
      categoryControl.markAsTouched();
      this.errorMessage.set("Enter a product name and select a category first.");
      return;
    }

    const category = this.categories().find(
      (item) => item._id === categoryControl.getRawValue()
    );

    if (!category) {
      this.errorMessage.set("The selected product category is not available.");
      return;
    }

    this.descriptionController?.abort();
    this.descriptionController = new AbortController();
    this.descriptionVisible.set(true);
    this.generatingDescription.set(true);
    this.errorMessage.set("");
    this.form.controls.description.setValue("");

    try {
      for await (const chunk of this.productService.generateDescription(
        {
          name: nameControl.getRawValue(),
          sku: this.form.controls.sku.getRawValue() || undefined,
          categoryName: category.name,
          requiresPrescription: category.requiresPrescription
        },
        this.descriptionController.signal
      )) {
        const description = `${this.form.controls.description.getRawValue()}${chunk}`;
        this.form.controls.description.setValue(description.slice(0, 1000));
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        this.errorMessage.set(
          error instanceof Error
            ? error.message
            : "Could not generate the product description."
        );
      }
    } finally {
      this.generatingDescription.set(false);
    }
  }

  cancelDescriptionGeneration(): void {
    this.descriptionController?.abort();
    this.generatingDescription.set(false);
  }

  async remove(product: Product): Promise<void> {
    if (!window.confirm(`Delete product "${product.name}"?`)) {
      return;
    }

    this.errorMessage.set("");

    try {
      await this.productService.delete(product._id);
      await this.loadProducts();
    } catch (error) {
      this.errorMessage.set(getApiErrorMessage(error, "Could not delete the product."));
    }
  }

  categoryName(product: Product): string {
    return typeof product.productCategoryId === "string"
      ? "Unknown category"
      : product.productCategoryId.name;
  }

  requiresPrescription(product: Product): boolean {
    return (
      typeof product.productCategoryId !== "string" &&
      product.productCategoryId.requiresPrescription
    );
  }
}
