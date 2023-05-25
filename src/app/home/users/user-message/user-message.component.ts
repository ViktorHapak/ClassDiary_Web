import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent {
  @Input() message!: string;

  @Output()
  messageClose: EventEmitter<string> = new EventEmitter<string>();

  onMessageClose() {
    this.messageClose.emit("close");
  }

}
