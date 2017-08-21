import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Http } from '@angular/http'
import 'rxjs/add/operator/map'

@Injectable()
export class HabitsService {
  constructor (private http: Http) {}

  getUserHabits () : Observable<Habit[]> {
    return this.http.get('/api/habits').map(res => res.json())
  }

  addDate (date, habitId): Observable<any> {
    return this.http.post('/api/habits/' + habitId + '/dates', {date})
  }

  deleteDate (date, habitId): Observable<any> {
    return this.http.delete('/api/habits/' + habitId + '/dates/' + date.toISOString())
  }

  addNewHabit (habitName) {
    return this.http.post('/api/habits', {name: habitName}).map(res => res.json())
  }

  deleteHabit (id) {
    return this.http.delete('/api/habits/' + id)
  }
}

export interface HabitDate {
  id: number,
  date: string,
  habitId: number
}

export interface Habit {
  id: number,
  name: string,
  dates: HabitDate[]
}
