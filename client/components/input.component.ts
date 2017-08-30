import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'input-edit',
  template: `
    <input *ngIf="showInput" #name type="text" (keyup.enter)="showInput = false; changeName(name.value)"
       placeholder="{{text}}" />
    <h3 *ngIf="!showInput" (click)="showInput = true">{{this.text}}<h3>
  `
})
export class InputComponent {
  @Input() text: String
  @Output() nameChanged = new EventEmitter()
  showInput: boolean

  constructor () {
    this.showInput = false
  }

  changeName (newName) {
    this.nameChanged.emit({
      name: newName
    })
  }
}
