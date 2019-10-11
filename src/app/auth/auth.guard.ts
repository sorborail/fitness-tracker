import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as RootState from '../app.reducer';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private store: Store<RootState.State>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.store.select(RootState.getIsAuth).pipe(take(1));
  }

  canLoad(route: Route): boolean | Promise<boolean> | Observable<boolean> {
    return this.store.select(RootState.getIsAuth).pipe(take(1));
  }
}
