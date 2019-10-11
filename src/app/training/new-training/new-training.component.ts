import {Component, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {Exercise} from '../exercise.model';
import * as TrainingState from '../training.reducer';
import * as RootState from '../../app.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  isLoading$: Observable<boolean>;
  exercises$: Observable<Exercise[]>;

  constructor(private trainingService: TrainingService, private store: Store<{ui: TrainingState.State}>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(RootState.getIsLoading);
    this.exercises$ = this.store.select(TrainingState.getAvailableExercises);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
