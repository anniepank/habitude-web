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
  constructor (private habitsService: HabitsService) { }

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
    } else {
      this.habitsService.deleteDate(convertToDate(index), this.habit.id).subscribe()
    }
  }

  deleteHabit (habit) {
    this.habitsService.deleteHabit(habit.id).subscribe(() => {
      this.deleted.emit()
    })
  }
}
