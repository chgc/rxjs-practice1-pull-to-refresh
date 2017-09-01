import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/concat';

import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {LoadNotifyService} from '../load-notify.service';

@Component({
  selector: 'app-pull-to-refresh',
  template: `
  <div style="position: absolute; top: 0; left: 50%">
    <div style="margin-left: -35px" [style.transform]="positionTranslate3d$ | async">
      <svg width="70px" height="70" [style.transform]="rotateTransform$ | async">
        <circle cy="35" cx="35" r="35" fill="lightgrey"></circle>
        <circle cy="15" cx="35" r="10" fill="black"></circle>
      </svg>
    </div>
  </div>
  `,
  styles: []
})
export class PullToRefreshComponent {
  currentPos = 0;
  touchstart$ = Observable.fromEvent<TouchEvent>(document, 'touchstart');
  touchend$ = Observable.fromEvent<TouchEvent>(document, 'touchend');
  touchmove$ = Observable.fromEvent<TouchEvent>(document, 'touchmove');

  completeAnimation$ =
      this.loadNotifyService.loadComplete$.map(() => this.currentPos)
          .switchMap(currentPos => this.tweenObservable(currentPos, 0, 200))

  drag$ = this.touchstart$
              .switchMap(start => {
                let pos = 0;
                return this.touchmove$
                    .map(move => move.touches[0].pageY - start.touches[0].pageY)
                    .do(p => pos = p)
                    .takeUntil(this.touchend$)
                    .concat(Observable.defer(
                        () => this.tweenObservable(pos, 0, 200)));
              })
              .do(p => {
                if (p >= window.innerHeight / 2) {
                  this.loadNotifyService.requestLoad$.next();
                }
              })
              .takeWhile(p => p < window.innerHeight / 2)
              .repeat();
  position$: Observable<number> = this.drag$.merge(this.completeAnimation$)
                                      .startWith(0)
                                      .do(pos => this.currentPos = pos);


  positionTranslate3d$: Observable<string> =
      this.position$.map(p => `translate3d(0, ${p - 70}px, 0)`);

  // Start rotating when a request is made and spin until it completes
  rotate$: Observable<number> =
      this.loadNotifyService.requestLoad$.switchMap(() => {
        let rot = 0;
        return this.tweenObservable(0, 360, 500)
            .repeat()
            .do(r => rot = r)
            .takeUntil(this.loadNotifyService.loadComplete$)
            .concat(Observable.defer(
                () => this.tweenObservable(rot, 360, 360 - rot)));
      });

  rotateTransform$: Observable<string> =
      this.rotate$.map(r => `rotate(${r}deg)`);
  constructor(private loadNotifyService: LoadNotifyService) {}

  private tweenObservable(start, end, time) {
    const emissions = time / 10;
    const step = (start - end) / emissions;

    return Observable.timer(0, 10)
        .map(x => start - step * (x + 1))
        .take(emissions);
  }
}
