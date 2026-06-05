import { Component, computed, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { getApiErrorMessage } from "../../core/services/fetch-api";
import { ProductCategoryService } from "../../core/services/product-category.service";
import {
  ProductCategory,
  ProductCategoryInput
} from "../../shared/models/product-category.model";

@Component({
  selector: "app-product-categories",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./product-categories.component.html",
  styleUrl: "./product-categories.component.css"
})
export class ProductCategoriesComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoryService = inject(ProductCategoryService);

  private loadController: AbortController | null = null;

  readonly categories = signal<ProductCategory[]>([]);
  readonly editingId = signal<string | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal("");
  readonly categoryCount = computed(() => this.categories().length);

  readonly form = this.formBuilder.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ["", [Validators.maxLength(500)]],
    requiresPrescription: [false],
    active: [true]
  });

  ngOnInit(): void {
    void this.loadCategories();
  }

  ngOnDestroy(): void {
    this.loadController?.abort();
  }

  async loadCategories(): Promise<void> {
    this.loadController?.abort();
    this.loadController = new AbortController();
    this.loading.set(true);
    this.errorMessage.set("");

    try {
      const response = await this.categoryService.list(this.loadController.signal);
      this.categories.set(response.data ?? []);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        this.errorMessage.set(
          getApiErrorMessage(error, "Could not load product categories.")
        );
      }
    } finally {
      this.loading.set(false);
    }
  }

  edit(category: ProductCategory): void {
    this.editingId.set(category._id);
    this.form.setValue({
      name: category.name,
      description: category.description ?? "",
      requiresPrescription: category.requiresPrescription,
      active: category.active
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({
      name: "",
      description: "",
      requiresPrescription: false,
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
    const input: ProductCategoryInput = {
      ...raw,
      description: raw.description || undefined
    };
    const editingId = this.editingId();

    try {
      if (editingId) {
        await this.categoryService.update(editingId, input);
      } else {
        await this.categoryService.create(input);
      }

      this.cancelEdit();
      await this.loadCategories();
    } catch (error) {
      this.errorMessage.set(
        getApiErrorMessage(error, "Could not save the product category.")
      );
    } finally {
      this.saving.set(false);
    }
  }

  async remove(category: ProductCategory): Promise<void> {
    if (!window.confirm(`Delete category "${category.name}"?`)) {
      return;
    }

    this.errorMessage.set("");

    try {
      await this.categoryService.delete(category._id);
      await this.loadCategories();
    } catch (error) {
      this.errorMessage.set(
        getApiErrorMessage(error, "Could not delete the product category.")
      );
    }
  }
}
