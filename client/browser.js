class Router {
  constructor () {
    this.routes = []
  }

  addRoute (regex, view, funcView) {
    this.routes.push({reg: regex, view: view, func: funcView})
  }

  route () {
    for (let i = 0; i < this.routes.length; i++) {
      let regex = this.routes[i].reg
      let match = window.location.pathname.match(regex)
      if (match) {
        this.routes[i].func(match, this.routes[i].view)
      } else {
        this.routes[i].view.style.display = 'none'
      }
    }
  }
}

let router = new Router()

let headers = new window.Headers()
headers.append('Content-type', 'application/json')

function loginView (match, view) {
  view.style.display = 'block'
}

function mainView (match, view) {
  document.querySelector('#habitList').innerHTML = ''
  view.style.display = 'block'
  window.fetch('/api/userHabits', {
    credentials: 'same-origin',
    headers: headers,
    method: 'GET'
  }).then(res => {
    res.json().then(habits => {
      for (let i = 0; i < habits.length; i++) {
        let habitContainer = createHabitTemplate()
        drawHabit(habitContainer, habits[i])
        document.querySelector('#habitList').appendChild(habitContainer)
      }
    })
  })
  isLoggedIn((err, res) => {
    let openNewHabitModal = document.querySelector('#openNewHabitModal')
    if (err) {
      return console.log(err)
    }
    if (res) {
      openNewHabitModal.style.display = 'inline-block'
    } else {
      openNewHabitModal.style.display = 'none'
    }
  })
}

function registrationView (match, view) {
  view.style.display = 'block'
  view.querySelector('#registrationButton').addEventListener('click', () => {
    window.fetch('/api/registration', {
      credentials: 'same-origin',
      headers,
      method: 'POST',
      body: JSON.stringify({
        login: view.querySelector('.login').value,
        password: view.querySelector('.password').value
      })
    }).then(res => {
      if (res.status === 200) {
        changePage('/')
        refreshNavbar()
      } else if (res.status === 409) {
        window.alert('Login Exits!')
      } else {
        window.alert(res.body)
      }
    })
  })
}

let mainPage = document.querySelector('#mainPage')
let loginPage = document.querySelector('#loginPage')
let registrationPage = document.querySelector('#registrationPage')

router.addRoute('^/$', mainPage, mainView)
router.addRoute('^/loginPage$', loginPage, loginView)
router.addRoute('^/registrationPage$', registrationPage, registrationView)

router.route()

window.addEventListener('popstate', (event) => {
  console.log('[popstate]', event)
  router.route()
  event.preventDefault()
})

function changePage (url) {
  console.log('[navigation]', url)
  window.history.pushState(null, null, url)
  router.route()
}

document.querySelector('#closeLogIn').addEventListener('click', () => {
  changePage('/')
})

document.querySelector('#loginButton').addEventListener('click', () => {
  window.fetch('/api/login', {
    headers: headers,
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify({
      login: document.querySelector('#loginPage .login').value,
      password: document.querySelector('#loginPage .password').value
    })
  }).then(res => {
    if (res.status === 200) {
      changePage('/')
      refreshNavbar()
    }
    if (res.status === 401) {
      window.alert('Wrong login or password!')
    }
  })
})

document.querySelector('#showLoginPage').addEventListener('click', () => {
  changePage('/loginPage')
})

document.querySelector('#showRegistrationPage').addEventListener('click', () => {
  changePage('/registrationPage')
})

document.querySelector('#logOutButton').addEventListener('click', () => {
  window.fetch('/api/stopSession', {
    credentials: 'same-origin',
    headers
  }).then(res => {
    res.json().then(isDeleted => {
      if (isDeleted) {
        changePage('/')
        refreshNavbar()
      }
    })
  })
})

document.querySelector('.navbar-brand').addEventListener('click', (event) => {
  changePage('/')
  event.preventDefault()
})

function drawHabit (view, habit) {
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
        window.fetch('/api/addDate', {
          credentials: 'same-origin',
          method: 'POST',
          headers,
          body: JSON.stringify({
            habitId: habit.id,
            date: date
          })
        })
      } else {
        window.fetch('/api/deleteDate', {
          credentials: 'same-origin',
          method: 'POST',
          headers,
          body: JSON.stringify({
            habitId: habit.id,
            date: date
          })
        })
      }
    })
  }
}

function createHabitTemplate () {
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

function isLoggedIn (callback) {
  window.fetch('/api/loggedIn', {
    credentials: 'same-origin',
    headers
  }).then(res => {
    res.json().then(result => {
      callback(null, result)
    })
  }).catch(err => {
    callback(err, null)
  })
}

function refreshNavbar () {
  let logInButton = document.querySelector('#showLoginPage')
  let logOutButton = document.querySelector('#logOutButton')
  isLoggedIn((err, result) => {
    if (err) {
      console.warn('lol bug')
    }
    if (result) {
      logInButton.style.display = 'none'
      logOutButton.style.display = 'inline-block'
    } else {
      logInButton.style.display = 'inline-block'
      logOutButton.style.display = 'none'
    }
  })
}

document.querySelector('#openNewHabitModal').addEventListener('click', () => {
  document.getElementById('newHabitDialog').classList.add('show')
})

document.querySelector('#newHabitDialog .close').addEventListener('click', () => {
  document.getElementById('newHabitDialog').classList.remove('show')
})

document.querySelector('#newHabitButton').addEventListener('click', () => {
  let habitName = document.querySelector('.newHabitName').value
  if (habitName) {
    window.fetch('/api/addNewHabit', {
      credentials: 'same-origin',
      headers,
      method: 'POST',
      body: JSON.stringify({
        name: habitName
      })
    }).then(res => {
      res.json().then(habit => {
        let habitContainer = createHabitTemplate()
        drawHabit(habitContainer, habit)
        document.querySelector('#mainPage').appendChild(habitContainer)
        document.getElementById('newHabitDialog').classList.remove('show')
      })
    })
  }
})

refreshNavbar()
