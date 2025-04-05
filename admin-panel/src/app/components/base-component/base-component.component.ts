import { Component, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Component({
  selector: "app-base-component",
  standalone: true,
  imports: [],
  templateUrl: "./base-component.component.html",
  styleUrl: "./base-component.component.scss",
})
export class BaseComponent implements OnDestroy {
  public readonly onDestroy$ = new Subject<void>();

  private isLoading$ = new BehaviorSubject<boolean>(false);

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  setLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }

  getLoading() {
    return this.isLoading$.asObservable();
  }
}
