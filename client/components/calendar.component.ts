import { Component } from '@angular/core'

@Component ({
  selector: 'calendar',
  template: `
  <button (click)="this.setLastMonth(); this.getDays(this.currentDate)"> < </button>
    <table class="table">
      <tr>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
        <th>Sun</th>
      </tr>
      <tr *ngFor="let i of [0, 1, 2, 3, 4, 5, 6]">
        <td class="text-center" *ngFor="let day of this.days.slice(i * 7, i * 7 + 7)" [class.text-muted]="!day.currentMonth">{{day.date.getDate()}}</td>
      </tr>
    </table>
    <button> > </button>
  `
  })
export class CalendarComponent {
  days : Day[]
  currentDate: Date
  constructor ( ) {
    this.currentDate = new Date()
    this.getDays(new Date())

  }

  getDays (currentDate) {
    this.days = []
    let today  = new Date()
    today.setTime(currentDate.getTime())

    let firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

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

    while ( firstDay.getTime() <= lastDay.getTime() ) {
      let copiedDate = new Date(firstDay.getTime())
      this.days.push({
        date: copiedDate,
        checked: false,
        currentMonth: true
      })
      firstDay.setDate(firstDay.getDate() + 1)
    }

    if (lastDay.getDay() != 0) {
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
  //  return this.days
  }

  setLastMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
  }

}

interface Day {
  date: Date,
  checked: boolean,
  currentMonth: boolean
}
