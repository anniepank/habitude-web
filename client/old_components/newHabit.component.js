class NewHabitController {
  constructor (habits) {
    this.habits = habits
  }

  addNewHabit (habitName) {
    this.habits.addNewHabit(habitName).then(newHabit => {
      this.modalInstance.close(newHabit)
    })
  }

  dismissModal () {
    this.modalInstance.dismiss()
  }
}

export const newHabitComponent = {
  templateUrl: '/client/components/newHabit.component.html',
  controller: NewHabitController,
  bindings: {
    modalInstance: '<'
  }
}
