window.router = new Router()

let mainPage = document.querySelector('#mainPage')
let loginPage = document.querySelector('#loginPage')
let registrationPage = document.querySelector('#registrationPage')

window.router.addRoute('^/$', mainPage, mainView)
window.router.addRoute('^/loginPage$', loginPage, loginView)
window.router.addRoute('^/registrationPage$', registrationPage, registrationView)

window.router.route()

window.addEventListener('popstate', (event) => {
  console.log('[popstate]', event)
  window.router.route()
  event.preventDefault()
})

document.querySelector('#closeLogIn').addEventListener('click', () => {
  changePage('/')
})

document.querySelector('#loginButton').addEventListener('click', () => {
  request('/api/login', {
    method: 'POST',
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
  request('/api/stopSession').then(res => res.json()).then(idDeleted => {
    if (idDeleted) {
      changePage('/')
      refreshNavbar()
    }
  })
})

document.querySelector('.navbar-brand').addEventListener('click', (event) => {
  changePage('/')
  event.preventDefault()
})

document.querySelector('#openNewHabitModal').addEventListener('click', () => {
  document.getElementById('newHabitDialog').classList.add('show')
})

document.querySelector('#newHabitDialog .close').addEventListener('click', () => {
  document.getElementById('newHabitDialog').classList.remove('show')
})

document.querySelector('#newHabitButton').addEventListener('click', () => {
  let habitName = document.querySelector('.newHabitName').value
  if (habitName) {
    request('/api/addNewHabit', {
      method: 'POST',
      body: JSON.stringify({
        name: habitName
      })
    }).then(res => {
      res.json().then(habit => {
        let habitContainer = createHabitTemplate()
        drawHabit(habitContainer, habit)
        document.querySelector('#habitList').appendChild(habitContainer)
        document.getElementById('newHabitDialog').classList.remove('show')
      })
    })
  }
})

refreshNavbar()
