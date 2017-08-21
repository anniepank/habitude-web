import {Component, Input} from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HabitsService,  Habit } from '../services/habits.service'

@Component({
  selector: 'new-habit-modal',
  templateUrl: '/client/components/newHabit.component.html'
})
export class NewHabitModal {
  @Input() name;
  constructor(public modalRef: NgbActiveModal, private habitService: HabitsService) {}

  add (name) {
    this.habitService.addNewHabit(name).subscribe((habit) => {
      this.modalRef.close(habit)
    })
  }
}
