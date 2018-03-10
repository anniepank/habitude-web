import { Component, Input, Output, EventEmitter } from '@angular/core'
import { AuthService } from '../services/authService'
import { HabitsService, Habit } from '../services/habits.service'
import { getToday, intToDate, dateToInt } from '../common'

function convertToDate (index) {
  return getToday() - (5 - index)
}

@Component({
  selector: 'habit',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss']
})
export class HabitComponent {
  @Input() habit: Habit
  @Output() deleted = new EventEmitter()
  constructor (private habitsService: HabitsService) {
  }

  isDateChecked (index) {
    let date = convertToDate(index)

    for (let j = 0; j < this.habit.dates.length; j++) {
      if (this.habit.dates[j].date === date) {
        return true
      }
    }
    return false
  }

  toggleDate (index) {
    if (!this.isDateChecked(index)) {
      this.habitsService.addDate(convertToDate(index), this.habit.id).subscribe(date => {
        this.habit.dates.push(date)
      })
    } else {
      this.habitsService.deleteDate(convertToDate(index), this.habit.id).subscribe()
      this.habit.dates = this.habit.dates.filter(date => date.date !== convertToDate(index))
    }
  }

  deleteHabit (habit) {
    this.habitsService.deleteHabit(habit.id).subscribe(() => {
      this.deleted.emit()
    })
  }

  countStreak () {
    let streak = 1
    let today = getToday()

    if (!this.habit.dates.length) {
      return 0
    }

    this.habit.dates.sort((a, b) => a.date - b.date)

    if (this.habit.dates[this.habit.dates.length - 1].date !== today) {
      return 0
    }

    for (let i = this.habit.dates.length - 1; i > 0; i--) {
      let date = this.habit.dates[i].date
      let prevDate = this.habit.dates[i - 1].date
      if (date - prevDate === 1) {
        streak++
      } else {
        break
      }
    }
    return streak
  }
}
