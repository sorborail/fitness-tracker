import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Exercise} from '../exercise.model';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  isLoading = true;
  exercises: Exercise[]; // Observable<Exercise[]> - but need fix spread operator
  private exercisesSub: Subscription;
  private loadingSub: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UiService) { }

  ngOnInit() {
    this.loadingSub = this.uiService.loadingStateChanged$.subscribe(isLoading => this.isLoading = isLoading);
    this.exercisesSub = this.trainingService.exercisesChanged$.subscribe(exercises => this.exercises = exercises);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    if (this.exercisesSub) {
      this.exercisesSub.unsubscribe();
    }
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
