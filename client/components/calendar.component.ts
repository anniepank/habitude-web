import { Component, Input, Output, EventEmitter } from '@angular/core'
import { HabitsService, Habit, HabitDate } from '../services/habits.service'

@Component({
  selector: 'calendar',
  template: `
    <button (click)="setLastMonth(); updateCalendar(currentDate)"> < </button>
    <table class="table text-center" *ngIf="dates">
      <caption class="month-caption" style="caption-side:top">{{monthNames[currentDate.getMonth()]}}</caption>
      <tr>
        <th class="text-center">Mon</th>
        <th class="text-center">Tue</th>
        <th class="text-center">Wed</th>
        <th class="text-center">Thu</th>
        <th class="text-center">Fri</th>
        <th class="text-center">Sat</th>
        <th class="text-center">Sun</th>
      </tr>
      <tr *ngFor="let i of [0, 1, 2, 3, 4, 5, 6]">
        <td
          *ngFor="let day of days.slice(i * 7, i * 7 + 7)"
          [class.text-muted]="!day.currentMonth"
          [ngClass]="{'dateChecked': checkDate(day) }"
          (click)="toggleDate(day.date)"
        >
          {{day.date.getDate()}}
        </td>
      </tr>
    </table>
    <button (click)="setNextMonth(); updateCalendar(currentDate)"> > </button>
  `,
})
export class CalendarComponent {
  @Input() dates: HabitDate[]
  @Output() toggleDateEvent = new EventEmitter()

  days: Day[]
  currentDate: Date
  monthNames: String[]
  constructor ( ) {
    this.currentDate = new Date()
    this.updateCalendar(new Date())
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  }

  ngOnInit () {
    console.log(this.dates)
  }

  ngOnChanges () {
    this.updateCalendar(this.currentDate)
  }

  checkDate (day) {
    return this.dates.some(x => x.date === day.date.toISOString())
  }

  updateCalendar (currentDate) {
    this.days = []
    let today = new Date()
    today.setTime(currentDate.getTime())

    let firstDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1))
    let lastDay = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0))

    if (firstDay.getDay() === 0) {
      for (let i = 6; i > 0; i--) {
        let newDate = new Date(firstDay)
        newDate.setDate(firstDay.getDate() - i)

        this.days.push({
          date: newDate,
          checked: false,
          currentMonth: false
        })
      }
    } else {
      for (let i = firstDay.getDay() - 1; i > 0; i--) {
        let newDate = new Date(firstDay)
        newDate.setDate(firstDay.getDate() - i)

        this.days.push({
          date: newDate,
          checked: false,
          currentMonth: false
        })
      }
    }

    while (firstDay.getTime() <= lastDay.getTime() ) {
      let copiedDate = new Date(firstDay.getTime())
      this.days.push({
        date: copiedDate,
        checked: false,
        currentMonth: true
      })
      firstDay.setDate(firstDay.getDate() + 1)
    }

    if (lastDay.getDay() !== 0) {
      for (let i = 1; i <= 7 - lastDay.getDay(); i++) {
        let copiedDate = new Date(lastDay)
        copiedDate.setDate(lastDay.getDate() + i)
        this.days.push({
          date: copiedDate,
          checked: false,
          currentMonth: false
        })
      }
    }
  }

  setLastMonth () {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
  }

  setNextMonth () {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1)
  }

  toggleDate (date) {
    this.toggleDateEvent.emit({
      date: date
    })
  }
}

interface Day {
  date: Date,
  checked: boolean,
  currentMonth: boolean
}
