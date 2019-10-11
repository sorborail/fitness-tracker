import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import {UiService} from '../../shared/ui.service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import * as RootState from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService, private uiService: UiService, private store: Store<{ui: RootState.State}>) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(RootState.getIsLoading);
    // this.loadingSub = this.uiService.loadingStateChanged$.subscribe(isLoading => this.isLoading = isLoading);
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  // ngOnDestroy(): void {
  //   if (this.loadingSub) {
  //     this.loadingSub.unsubscribe();
  //   }
  // }
}

