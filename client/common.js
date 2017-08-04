let headers = new window.Headers()
headers.append('Content-type', 'application/json')

function isLoggedIn () {
  return request('/api/loggedIn').then(res => res.json()).then(result => {
    return result
  })
}

function request (url, options) {
  options = Object.assign({
    credentials: 'same-origin',
    headers
  }, options || {})
  return window.fetch(url, options)
}

function refreshNavbar () {
  let logInButton = document.querySelector('#showLoginPage')
  let logOutButton = document.querySelector('#logOutButton')
  isLoggedIn().then(result => {
    if (result) {
      logInButton.style.display = 'none'
      logOutButton.style.display = 'inline-block'
    } else {
      logInButton.style.display = 'inline-block'
      logOutButton.style.display = 'none'
    }
  })
}

function changePage (url) {
  console.log('[navigation]', url)
  window.history.pushState(null, null, url)
  window.router.route()
}
