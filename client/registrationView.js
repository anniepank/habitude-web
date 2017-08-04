function registrationView (match, view) {
  view.style.display = 'block'
  view.querySelector('#registrationButton').addEventListener('click', () => {
    request('/api/registration', {
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
