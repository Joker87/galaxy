import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DefaultApiService, ILoadResponse } from './services/default-api.service';
import { Subject, throttleTime, switchMap, tap, timer, takeWhile, mergeMap, forkJoin } from 'rxjs';

@Component({
  selector: 'galaxy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public settings: ILoadResponse | null = null;
  public responses: { status: string }[] = [];

  public clickButton = new Subject<void>();
  public params: ILoadResponse | null = null;

  constructor(
    private _service: DefaultApiService,
    private _cdr: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this._service
      .load()
      .pipe(
        tap(params => this.params = params),
        // вариант 1 - отправка параллельно запросов не чаще чем delay
        switchMap(params => {
          this._cdr.detectChanges();

          const requests = [...Array(+params.count).keys()].map(
            () => this._service.process().pipe(tap(response => {
              this.responses.push(response);
              this._cdr.detectChanges();
            }))
          );

          return this.clickButton.pipe(
            throttleTime(+params.delay),
            switchMap(
              () => forkJoin(requests)
            )
          )
        })
      )
      .subscribe();
  }

  public onClick() {
    // вариант 2 отправка запросов последовательно с интервалом delay
    if (!this.params) {
      return;
    }

    const count = +this.params.count;
    const source = timer(0, +this.params.delay);

    source.pipe(
      takeWhile(n => n < count),
      mergeMap(() => this._service.process().pipe(
        tap(response => this.responses.push(response))
      ))
    ).subscribe(() => this._cdr.detectChanges())
  }
}
