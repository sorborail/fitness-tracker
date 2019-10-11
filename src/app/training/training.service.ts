import {Injectable} from '@angular/core';
import {Exercise} from './exercise.model';
import {Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {UiService} from '../shared/ui.service';
import * as UIActions from '../shared/ui.actions';
import * as TrainingState from './training.reducer';
import {Store} from '@ngrx/store';
import * as TrainingActions from './training.actions';


@Injectable({providedIn: 'root'})
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UiService, private store: Store<TrainingState.State>) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UIActions.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => docArray.map(doc => ({id: doc.payload.doc.id, ...doc.payload.doc.data()}))))
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UIActions.StopLoading());
        this.store.dispatch(new TrainingActions.SetAvailableTrainings(exercises));
      }, error1 => {
        this.store.dispatch(new UIActions.StopLoading());
        this.uiService.showSnackBar('Fetching exercises fail, please try again later!', null, 3000);
        this.store.dispatch(new TrainingActions.SetAvailableTrainings(null));
      }));
  }

  startExercise(id: string) {
    this.db.doc(`availableExercises/${id}`).update({lastSelected: new Date()});
    this.store.dispatch(new TrainingActions.StartTraining(id));
  }

  completeExercise() {
    this.store.select(TrainingState.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({...ex, date: new Date(), state: 'completed'});
      this.store.dispatch(new TrainingActions.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(TrainingState.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        date: new Date(),
        duration: ex.duration * progress / 100,
        calories: ex.calories * progress / 100,
        state: 'cancelled'
      });
      this.store.dispatch(new TrainingActions.StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises')
      .valueChanges()
      .pipe(map(exArray => exArray.map((ex: Exercise) => ({
        ...ex,
        date: (ex.date as unknown as Timestamp).toDate()
      }))))
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new TrainingActions.SetFinishedTrainings(exercises));
    }));
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
