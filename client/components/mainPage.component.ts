import { Component } from '@angular/core'
import { HabitsService, Habit } from '../services/habits.service'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { NewHabitModal } from './newHabit.component'
import { ChooseHabitModal } from './chooseHabit.component'
import { AuthService } from '../services/authService'

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations'

@Component({
  selector: 'habits-container',
  template: `
    <div *ngIf="this.authService.isLoggedIN">
      <habit *ngFor="let habit of habits"
        [habit]="habit"
        (deleted)="onHabitDeleted(habit)"
        @flyInOut></habit>
        <div class="add-new-habit-button" (click)="onNewHabit()">Add a new habit</div>
    </div>
  `,
  animations: [
    trigger('flyInOut', [
      transition(':leave', [
        style({transform: 'translateX(0)'}),
        animate(300, style({transform: 'translateX(100vw)'}))
      ])
    ])
  ]
})
export class MainPageComponent {
  habits: Habit[]

  constructor (
    private habitsService: HabitsService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router
  ) {
    habitsService.getUserHabits().subscribe(res => {
      this.habits = res
    })
  }

  onHabitDeleted (habit: Habit) {
    this.habits = this.habits.filter(x => x.id !== habit.id)
  }

  onNewHabit () {
    const modalRef = this.modalService.open(ChooseHabitModal)
    modalRef.result.then(habit => {
      this.habits.push(habit)
      if (habit.name === 'other') {
        this.router.navigate(['/habit/' + habit.id])
      }
    }).catch(() => {})
  }
}
