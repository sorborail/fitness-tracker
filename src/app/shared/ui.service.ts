import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable({providedIn: 'root'})
export class UiService {
  loadingStateChanged$: Subject<boolean> = new Subject();

  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(message, action, duration) {
    this.snackBar.open(message, action, {duration});
  }
}
