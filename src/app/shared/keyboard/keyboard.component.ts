import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleKeyPress(event.key);
  }

  @Input() keyboardResults!: any;
  @Output() keypressFunction = new EventEmitter();
  keyboardKeys!: any[];
  allowedChars!:any[];
  currentInput: any;

  constructor() {
    this.keyboardKeys = [
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"
    ];
    this.allowedChars = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "enter", "backspace"];

  }

  ngOnInit(): void {
  }

  handleKeyPress(key: string) {
    key = key.toLowerCase()
    if (this.allowedChars.includes(key))
      this.keypressFunction.emit(key);
  }
}
