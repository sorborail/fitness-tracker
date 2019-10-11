import {Component, OnInit} from '@angular/core';

import * as TrainingState from './training.reducer';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {

  ongoingTraining$: Observable<boolean>;

  constructor(private store: Store<TrainingState.State>) { }

  ngOnInit() {
    this.ongoingTraining$ = this.store.select(TrainingState.getIsTraining);
  }
}
