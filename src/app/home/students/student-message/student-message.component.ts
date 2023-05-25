import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-student-message',
  templateUrl: './student-message.component.html',
  styleUrls: ['./student-message.component.css']
})
export class StudentMessageComponent {
  @Input() message!: string;

  @Output()
  messageClose: EventEmitter<string> = new EventEmitter<string>();

  onMessageClose() {
    this.messageClose.emit("close");
  }

}
