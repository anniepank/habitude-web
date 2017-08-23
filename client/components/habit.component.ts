import { Component, Input, Output, EventEmitter } from '@angular/core'
import { AuthService } from '../services/authService'
import { HabitsService, Habit } from '../services/habits.service'

function convertToDate (index) {
  let date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setDate(date.getDate() - (5 - index))

  return date
}

@Component({
  selector: 'habit',
  templateUrl: '/client/components/habit.component.html'
})
export class HabitComponent {
  @Input() habit: Habit
  @Output() deleted = new EventEmitter()
  constructor (private habitsService: HabitsService) {
  }

  isDateChecked (index) {
    let date = convertToDate(index)

    for (let j = 0; j < this.habit.dates.length; j++) {
      if (this.habit.dates[j].date === date.toISOString()) {
        return true
      }
    }
    return false
  }

  toggleDate (index) {
    if (!this.isDateChecked(index)) {
      this.habitsService.addDate(convertToDate(index), this.habit.id).subscribe()
      this.habit.dates.push({date: convertToDate(index).toISOString(), habitId: this.habit.id, id: null})
    } else {
      this.habitsService.deleteDate(convertToDate(index), this.habit.id).subscribe()
      this.habit.dates = this.habit.dates.filter(date => date.date != convertToDate(index).toISOString())
    }
  }

  deleteHabit (habit) {
    this.habitsService.deleteHabit(habit.id).subscribe(() => {
      this.deleted.emit()
    })
  }

  countStreak () {
    let streak = 1
    let today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    this.habit.dates.sort(function(a, b) {
      let dateA = new Date(a.date)
      let dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    if (this.habit.dates[this.habit.dates.length - 1].date != today.toISOString()) {
      return 0
    }

    for(let i = this.habit.dates.length - 1; i > 0; i--) {
      let date = new Date(this.habit.dates[i].date)
      let prevDate = new Date(this.habit.dates[i-1].date)
      if ((date.getTime() - prevDate.getTime()) === 86400000) {
        streak++
      } else {
        break;
      }
    }
    return streak
  }
}
