import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS, SetAvailableTrainings, SetFinishedTrainings,
  START_TRAINING, StartTraining, STOP_TRAINING, StopTraining,
  TrainingActions
} from './training.actions';
import {Exercise} from './exercise.model';
import * as RootState from '../app.reducer';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

export interface State extends RootState.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {...state, availableExercises: action instanceof SetAvailableTrainings ? action.payload : []};
    case SET_FINISHED_TRAININGS:
      return {...state, finishedExercises: action instanceof SetFinishedTrainings ? action.payload : []};
    case START_TRAINING:
      return {...state, activeTraining: action instanceof StartTraining ?
          {...state.availableExercises.find(ex => ex.id === action.payload)} : null};
    case STOP_TRAINING:
      return {...state, activeTraining: null};
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining !== null);
