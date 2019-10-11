import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {StopTrainingComponent} from './stop-training.component';
import {Subscription} from 'rxjs';
import {TrainingService} from '../training.service';
import * as TrainingState from '../training.reducer';
import {Store} from '@ngrx/store';
import {Exercise} from '../exercise.model';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {

  progress = 0;
  timer: number;
  dialogSub: Subscription;

  constructor(private dialog: MatDialog, private trainingService: TrainingService, private store: Store<TrainingState.State>) { }

  ngOnInit() {
    this.actionTimer();
  }

  actionTimer() {
    this.store.select(TrainingState.getActiveTraining).pipe(take(1)).subscribe((ex: Exercise) => {
      const step = ex.duration / 100 * 1000;
      this.timer = setInterval(() => {
        this.progress += 1;
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {data: {progress: this.progress}});
    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else { this.actionTimer(); }
    });
  }

  ngOnDestroy(): void {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }
}
