import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/do';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {LoadNotifyService} from '../load-notify.service';
import {UserFeedService} from '../user-feed.service';

@Component({
  selector: 'app-latest-users',
  template: `
  <app-pull-to-refresh></app-pull-to-refresh>

  <h3>Latest Users</h3>
  <div>
    <article *ngFor="let user of (users$ | async)">
      <h4>{{ user.first }} {{ user.last }}</h4>
      <p>Joined: {{ user.created | date: 'yyyy/MM/dd' }}</p>
      <p>Balance: {{ user.balance | currency: 'USD': true }}</p>
      <p>Contact: {{ user.address }}, {{ user.email }}</p>
    </article>
  </div>
  `,
  styles: []
})
export class LatestUsersComponent {
  updateUsersTrigger$ =
      Observable.timer(0, 10000).merge(this.loadNotifyService.requestLoad$);
  users$ =
      this.updateUsersTrigger$.switchMap(() => this.userFeedService.getUsers())
          .do(this.loadNotifyService.loadComplete$);

  constructor(
      private userFeedService: UserFeedService,
      private loadNotifyService: LoadNotifyService) {}
}
