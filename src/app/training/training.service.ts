import {Injectable} from '@angular/core';
import {Exercise} from './exercise.model';
import {Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {UiService} from '../shared/ui.service';


@Injectable({providedIn: 'root'})
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private finishedExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  exerciseChanged$: Subject<Exercise> = new Subject();
  exercisesChanged$: Subject<Exercise[]> = new Subject();
  finishedExercisesChanged$: Subject<Exercise[]> = new Subject();

  constructor(private db: AngularFirestore, private uiService: UiService) {}

  fetchAvailableExercises() {
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => docArray.map(doc => ({id: doc.payload.doc.id, ...doc.payload.doc.data()}))))
      .subscribe((exercises: Exercise[]) => {
        console.log(exercises);
        this.availableExercises = exercises;
        this.exercisesChanged$.next([...this.availableExercises]);
        this.uiService.loadingStateChanged$.next(false);
      }, error1 => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackBar('Fetching exercises fail, please try again later!', null, 3000);
        this.exercisesChanged$.next(null);
      }));
  }

  startExercise(id: string) {
    this.db.doc(`availableExercises/${id}`).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercises.find(ex => ex.id === id);
    this.exerciseChanged$.next({...this.runningExercise});
  }

  completeExercise() {
    this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChanged$.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      duration: this.runningExercise.duration * progress / 100,
      calories: this.runningExercise.calories * progress / 100,
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged$.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises')
      .valueChanges()
      .pipe(map(exArray => exArray.map((ex: Exercise) => ({
        ...ex,
        date: (ex.date as unknown as Timestamp).toDate()
      }))))
      .subscribe((exercises: Exercise[]) => {
        console.log(exercises);
        this.finishedExercisesChanged$.next(exercises);
    }));
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
