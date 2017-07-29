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
  document.querySelector('#mainPage').innerHTML = ''
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
        document.querySelector('#mainPage').appendChild(habitContainer)
      }
    })
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
  router.route()
  event.preventDefault()
})

function changePage (url) {
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

function drawHabit (view, habit) {
  view.getElementsByClassName('habitName')[0].innerHTML = habit.name
  // put checkboxes
}

function createHabitTemplate () {
  let habitContainer = document.createElement('div')
  habitContainer.classList.add('habitTemplate')
  habitContainer.cloneNode(true)

  let habitName = document.createElement('div')
  habitName.classList.add('habitName')
  habitContainer.appendChild(habitName)

  for (let i = 0; i < 5; i++) {
    let checkbox = document.createElement('input')
    checkbox.classList.add('check')
    checkbox.type = 'checkbox'
    habitContainer.appendChild(checkbox)
  }
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

refreshNavbar()
