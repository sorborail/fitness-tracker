import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];

  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  @ViewChild(MatPaginator, {static: false})
  paginator: MatPaginator;

  finishedExercisesSub: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.finishedExercisesSub = this.trainingService.finishedExercisesChanged$
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

  ngOnDestroy(): void {
    if (this.finishedExercisesSub) {
      this.finishedExercisesSub.unsubscribe();
    }
  }
}
