import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import * as RootState from '../../app.reducer';
import {Store} from '@ngrx/store';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output()
  sidenavToggle: EventEmitter<void> = new EventEmitter();

  isAuth$: Observable<boolean>;

  constructor(private store: Store<RootState.State>, private authService: AuthService) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(RootState.getIsAuth);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onExit() {
    this.authService.logout();
  }
}
