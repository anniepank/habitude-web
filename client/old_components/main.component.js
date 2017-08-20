class MainController {
  constructor (habits, authentication, $uibModal) {
    this.habitResource = habits
    habits.getUserHabits().then(habits => {
      this.habits = habits
    })
    this.authentication = authentication
    this.$uibModal = $uibModal
  }

  openComponentModal () {
    let modalInstance = this.$uibModal.open({
      component: 'new-habit'

    })

    modalInstance.result.then(result => {
      this.habits.push(result)
    })
  }

  delete (habit) {
    this.habitResource.deleteHabit(habit)
    this.habits = this.habits.filter(item => item !== habit)
  }
}

export const mainComponent = {
  templateUrl: '/client/components/main.component.html',
  controller: MainController
}
