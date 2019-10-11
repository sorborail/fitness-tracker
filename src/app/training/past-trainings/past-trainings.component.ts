import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';
import * as TrainingState from '../training.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];

  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  @ViewChild(MatPaginator, {static: false})
  paginator: MatPaginator;

  constructor(private trainingService: TrainingService, private store: Store<TrainingState.State>) { }

  ngOnInit() {
    this.store.select(TrainingState.getFinishedExercises)
      .subscribe((exercises: Exercise[]) => this.dataSource.data = exercises);
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  // ngOnDestroy(): void {
  //   if (this.finishedExercisesSub) {
  //     this.finishedExercisesSub.unsubscribe();
  //   }
  // }
}
