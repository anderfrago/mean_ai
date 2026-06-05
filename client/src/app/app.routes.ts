import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "products"
  },
  {
    path: "products",
    loadComponent: () =>
      import("./features/products/products.component").then(
        (module) => module.ProductsComponent
      )
  },
  {
    path: "product-categories",
    loadComponent: () =>
      import("./features/product-categories/product-categories.component").then(
        (module) => module.ProductCategoriesComponent
      )
  },
  {
    path: "status",
    loadComponent: () =>
      import("./features/home/home.component").then((module) => module.HomeComponent)
  },
  {
    path: "**",
    redirectTo: "products"
  }
];
