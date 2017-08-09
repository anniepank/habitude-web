export class Router {
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
