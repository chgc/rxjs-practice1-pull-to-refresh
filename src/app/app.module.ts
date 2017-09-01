import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LatestUsersComponent} from './latest-users/latest-users.component';
import {UserFeedService} from './user-feed.service';
import { LoadNotifyService } from './load-notify.service';
import { PullToRefreshComponent } from './pull-to-refresh/pull-to-refresh.component';

@NgModule({
  declarations: [AppComponent, LatestUsersComponent, PullToRefreshComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [UserFeedService, LoadNotifyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
