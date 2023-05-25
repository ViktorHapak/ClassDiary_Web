import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-lecturing-message',
  templateUrl: './lecturing-message.component.html',
  styleUrls: ['./lecturing-message.component.css']
})
export class LecturingMessageComponent {

  @Input() message!: string;

  @Output()
  messageClose: EventEmitter<string> = new EventEmitter<string>();

  onMessageClose() {
    this.messageClose.emit("close");
  }

}
