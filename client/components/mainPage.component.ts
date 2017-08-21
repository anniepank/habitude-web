import { Component } from '@angular/core'
import { HabitsService,  Habit } from '../services/habits.service'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewHabitModal } from './newHabit.component'

@Component({
  selector: 'habits-container',
  template: `
    <div>
      <habit *ngFor="let habit of habits" [habit]="habit" (deleted)="onHabitDeleted(habit)"></habit>
      <button class="btn btn-default" (click)="onNewHabit()">Add new habit</button>
    </div>
  `
})
export class MainPageComponent {
  habits: Habit[]

  constructor (private habitsService: HabitsService, private modalService: NgbModal) {
    habitsService.getUserHabits().subscribe(res => {
      this.habits = res
    })
  }

  onHabitDeleted (habit: Habit) {
    this.habits = this.habits.filter(x => x.id !== habit.id)
  }

  onNewHabit() {
    const modalRef = this.modalService.open(NewHabitModal)
    modalRef.result.then(habit => {
      this.habits.push(habit)
    })
  }
}
