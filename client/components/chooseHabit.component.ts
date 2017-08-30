import { Component } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { HabitsService, Habit } from '../services/habits.service'

@Component({
  selector: 'choose-habit-modal',
  templateUrl: '/client/components/chooseHabit.component.html',
  styleUrls: ['client/components/chooseHabit.component.css']
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
