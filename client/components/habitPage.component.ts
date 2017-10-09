import { Component } from '@angular/core'
import { HabitsService, Habit } from '../services/habits.service'
import { ActivatedRoute, Router } from '@angular/router'
import { toSequelizeDate } from '../common'
import 'rxjs/add/operator/first'

@Component({
  selector: 'habitPage',
  templateUrl: '/client/components/habitPage.component.html'
})
export class HabitPageComponent {
  id: number
  habit: Habit

  constructor (private habitsService: HabitsService, private route: ActivatedRoute, private router: Router) {
    route.params.first().subscribe(params => {
      this.id = params['id']
      this.habitsService.getHabit(this.id).subscribe(habit => {
        this.habit = habit
      })
    })
  }

  toggleDate ($event) {
    let date = toSequelizeDate($event.date)
    if (this.habit.dates.some(x => x.date === date)) {
      this.habitsService.deleteDate(date, this.habit.id).subscribe(res => {
        this.habit.dates = this.habit.dates.filter(d => d.date !== date)
      })
    } else {
      this.habitsService.addDate(date, this.habit.id).subscribe(res => {
        this.habit.dates = this.habit.dates.concat([{date: date, habitId: this.habit.id, id: null}])
      })
    }
  }

  deleteHabit () {
    this.habitsService.deleteHabit(this.habit.id).subscribe(() => {
      this.router.navigate(['/'])
    })
  }

  onNameChanged () {
    this.habitsService.changeHabitName(this.habit.id, this.habit.name).subscribe()
  }
}
