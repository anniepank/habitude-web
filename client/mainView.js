function mainView (match, view) {
  document.querySelector('#habitList').innerHTML = ''
  view.style.display = 'block'
  request('/api/userHabits').then(res => {
    res.json().then(habits => {
      for (let i = 0; i < habits.length; i++) {
        let habitContainer = createHabitTemplate()
        drawHabit(habitContainer, habits[i])
        document.querySelector('#habitList').appendChild(habitContainer)
      }
    })
  })
  isLoggedIn().then(result => {
    let openNewHabitModal = document.querySelector('#openNewHabitModal')
    if (result) {
      openNewHabitModal.style.display = 'inline-block'
    } else {
      openNewHabitModal.style.display = 'none'
    }
  })
}
