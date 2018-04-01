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
  templateUrl: './mainPage.component.html',
  styleUrls: ['./mainPage.component.scss'],
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

  leftInfo = [
    {
      title: 'Get Reminded',
      text: 'Our powerful and flexible reminders make it extremely easy to start a new habit!',
      icon: 'fa-clock',
    },
    {
      title: 'Synchronize',
      text: 'Easy synchronizing process will allow you not to lose your progress',
      icon: 'fa-sync-alt',
    },
    {
      title: 'Customizable',
      text: 'You can create your own habits or use defualt o',
      icon: 'fa-chart-pie',
    }
  ]

  rightInfo = [
    {
      title: 'No ads',
      text: 'App is fully free from advertisment',
      icon: 'fab fa-fly',
    },
    {
      title: 'Love',
      text: 'We love our users and they love us',
      icon: 'fa-heart',
    },
    {
      title: 'Not the end',
      text: 'Futher updates are coming, we are doing our best',
      icon: 'fa-chart-line',
    }
  ]

  constructor (
    private habitsService: HabitsService,
    private modalService: NgbModal,
    public authService: AuthService,
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
