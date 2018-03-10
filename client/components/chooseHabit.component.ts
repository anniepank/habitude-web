import { Component } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { HabitsService, Habit } from '../services/habits.service'
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations'

@Component({
  selector: 'choose-habit-modal',
  templateUrl: './chooseHabit.component.html',
  styleUrls: ['./chooseHabit.component.scss']
})
export class ChooseHabitModal {
  habits: String[]
  constructor (public modalRef: NgbActiveModal, private habitService: HabitsService) {
    this.habits = ['jogging', 'meditation', 'nutrition', 'reading', 'sport', 'workout', 'other']
  }

  add (habit) {
    this.habitService.addNewHabit(habit).subscribe((habit) => {
      this.modalRef.close(habit)
    })
  }
}
