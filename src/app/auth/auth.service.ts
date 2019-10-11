import {Injectable} from '@angular/core';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as RootState from '../app.reducer';
import * as UIActions from '../shared/ui.actions';
import * as AuthActions from './auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {
  // private isAuthFlag = false;

  // authChange: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<{ui: RootState.State}>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // this.isAuthFlag = true;
        // this.authChange.next(true);
        this.store.dispatch(new AuthActions.SetAuth());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.isAuthFlag = false;
        // this.authChange.next(false);
        this.store.dispatch(new AuthActions.SetNotAuth());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged$.next(true);
    this.store.dispatch(new UIActions.StartLoading());
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.store.dispatch(new UIActions.StopLoading());
        // this.uiService.loadingStateChanged$.next(false);
      })
      .catch(error => {
        // this.uiService.loadingStateChanged$.next(false);
        this.store.dispatch(new UIActions.StopLoading());
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged$.next(true);
    this.store.dispatch(new UIActions.StartLoading());
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // this.uiService.loadingStateChanged$.next(false);
        this.store.dispatch(new UIActions.StopLoading());
      })
      .catch(error => {
        // this.uiService.loadingStateChanged$.next(false);
        this.store.dispatch(new UIActions.StopLoading());
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  // getUser(): User {
  //   return {...this.user};
  // }

  // isAuth(): boolean {
  //   return this.isAuthFlag;
  // }
}
