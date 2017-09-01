import 'rxjs/add/operator/map';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

const api = 'https://randomapi.azurewebsites.net/api/users';

@Injectable()
export class UserFeedService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]|{}> {
    return this.http.get<any[]>(api)
        .map(users => users.slice(0, 10))
        .catch(err => {
          console.log('an error occured', err);
          return Observable.empty();
        });
  }
}
