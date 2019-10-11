import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import * as RootState from '../../app.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Output()
  closeSidenav: EventEmitter<void> = new EventEmitter();

  isAuth$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<RootState.State>) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(RootState.getIsAuth);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onExit() {
    this.closeSidenav.emit();
    this.authService.logout();
  }
}
