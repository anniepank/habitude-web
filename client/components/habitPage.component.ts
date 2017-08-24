import { Component } from '@angular/core'
import { HabitsService, Habit } from '../services/habits.service'
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/first'

@Component({
  selector: 'habitPage',
  templateUrl: '/client/components/habitPage.component.html'
})
export class HabitPageComponent {
  id: number
  habit: Habit

  constructor (private habitsService: HabitsService, route: ActivatedRoute) {
    route.params.first().subscribe(params => {
      this.id = params['id']
      this.habitsService.getHabit(this.id).subscribe(habit => {
        this.habit = habit
      })
    })
  }
}
