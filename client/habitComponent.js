import {request} from './common'
export function drawHabit (view, habit) {
  view.getElementsByClassName('habitName')[0].innerHTML = habit.name
  let checkboxContainer = view.querySelector('.checkboxContainer')
  let date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  for (let i = 0; i < checkboxContainer.childNodes.length; i++) {
    let currentCheckbox = checkboxContainer.querySelector('.check-' + (4 - i))
    if (habit.dates) {
      for (let j = 0; j < habit.dates.length; j++) {
        if (habit.dates[j].date === date.toISOString()) {
          currentCheckbox.checked = true
          break
        } else {
          currentCheckbox.checked = false
        }
      }
    }
    date.setDate(date.getDate() - 1)
    currentCheckbox.addEventListener('change', () => {
      let date = new Date()
      date.setUTCHours(0, 0, 0, 0)
      date.setDate(date.getDate() - i)
      if (currentCheckbox.checked) {
        request('/api/addDate', {
          method: 'POST',
          body: JSON.stringify({
            habitId: habit.id,
            date: date
          })
        })
      } else {
        request('/api/deleteDate', {
          method: 'POST',
          body: JSON.stringify({
            habitId: habit.id,
            date: date
          })
        })
      }
    })
  }
}

export function createHabitTemplate () {
  let habitContainer = document.createElement('div')
  habitContainer.classList.add('habitTemplate')
  habitContainer.cloneNode(true)

  let habitName = document.createElement('div')
  habitName.classList.add('habitName')
  habitContainer.appendChild(habitName)

  let checkboxContainer = document.createElement('div')
  checkboxContainer.classList.add('checkboxContainer')

  for (let i = 0; i < 5; i++) {
    let checkbox = document.createElement('input')
    checkbox.classList.add('check')
    checkbox.classList.add('check-' + i)
    checkbox.type = 'checkbox'
    checkboxContainer.appendChild(checkbox)
  }
  habitContainer.appendChild(checkboxContainer)
  return habitContainer
}
