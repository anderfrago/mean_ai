import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";

import { getApiErrorMessage } from "../../core/services/fetch-api";
import { HealthService } from "../../core/services/health.service";

type ViewModel =
  | { state: "loading" }
  | { state: "ready"; service: string }
  | { state: "error"; message: string };

@Component({
  selector: "app-home",
  standalone: true,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css"
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly healthService = inject(HealthService);
  private readonly controller = new AbortController();

  readonly vm = signal<ViewModel>({ state: "loading" });

  ngOnInit(): void {
    void this.loadHealth();
  }

  ngOnDestroy(): void {
    this.controller.abort();
  }

  private async loadHealth(): Promise<void> {
    try {
      const response = await this.healthService.getHealth(this.controller.signal);

      if (!response.data) {
        this.vm.set({
          state: "error",
          message: response.error?.message ?? "API returned no data"
        });
        return;
      }

      this.vm.set({ state: "ready", service: response.data.service });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        this.vm.set({
          state: "error",
          message: getApiErrorMessage(error, "API is not reachable")
        });
      }
    }
  }
}
