function convertToDate (index) {
  let date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setDate(date.getDate() - (5 - index))

  return date
}

class HabitController {
  constructor (habits) {
    this.habit = null
    this.habits = habits
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
      this.habits.addDate(convertToDate(index), this.habit.id)
    } else {
      this.habits.deleteDate(convertToDate(index), this.habit.id)
    }
  }

  deleteHabit () {
    this.onDelete()
  }
}

export const habitComponent = {
  templateUrl: '/client/components/habit.component.html',
  controller: HabitController,
  bindings: {
    habit: '<',
    onDelete: '&?'
  }
}
