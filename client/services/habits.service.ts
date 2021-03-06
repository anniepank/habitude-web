import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Http } from '@angular/http'
import 'rxjs/add/operator/map'

@Injectable()
export class HabitsService {
  constructor (private http: Http) {}

  getUserHabits (): Observable<Habit[]> {
    return this.http.get('/api/habits').map(res => res.json())
  }

  addDate (date: number, habitId): Observable<HabitDate> {
    return this.http.post('/api/habits/' + habitId + '/dates', {date}).map(res => res.json())
  }

  deleteDate (date: number, habitId): Observable<any> {
    return this.http.delete('/api/habits/' + habitId + '/dates/' + date)
  }

  addNewHabit (habitName) {
    return this.http.post('/api/habits', {name: habitName}).map(res => res.json())
  }

  deleteHabit (id) {
    return this.http.delete(`/api/habits/${id}`)
  }

  getHabit (id) {
    return this.http.get(`/api/habits/${id}`).map(res => res.json())
  }

  changeHabitName (id, name) {
    return this.http.put(`/api/habits/${id}`, {name: name}).map(res => res.json())
  }
}

export interface HabitDate {
  id: number,
  date: number,
  habitId: number
}

export interface Habit {
  id: number,
  name: string,
  dates: HabitDate[]
}
