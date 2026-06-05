import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { catchError, map, of, startWith } from "rxjs";

import { HealthService } from "../../core/services/health.service";

type ViewModel =
  | { state: "loading" }
  | { state: "ready"; service: string }
  | { state: "error"; message: string };

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css"
})
export class HomeComponent {
  private readonly healthService = inject(HealthService);

  readonly vm$ = this.healthService.getHealth().pipe(
    map((response): ViewModel => {
      if (!response.data) {
        return { state: "error", message: response.error?.message ?? "API returned no data" };
      }

      return { state: "ready", service: response.data.service };
    }),
    startWith({ state: "loading" } satisfies ViewModel),
    catchError(() => of({ state: "error", message: "API is not reachable" } satisfies ViewModel))
  );
}
