import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'input-edit',
  template: `
    <input *ngIf="showInput" #name type="text" (keyup.enter)="showInput = false; changeText(name.value)"
       value="{{text}}" />
    <h3 *ngIf="!showInput" (click)="showInput = true">{{text}}<h3>
  `
})
export class InputComponent {
  @Input() text: String
  @Output() textChange = new EventEmitter<string>()
  showInput: boolean

  constructor () {
    this.showInput = false
  }

  changeText (newText) {
    this.textChange.emit(newText)
  }
}
