import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output()
  closeSidenav: EventEmitter<void> = new EventEmitter();

  isAuth = false;

  authSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSub = this.authService.authChange.subscribe(authStatus => this.isAuth = authStatus);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onExit() {
    this.closeSidenav.emit();
    this.authService.logout();
  }
}
