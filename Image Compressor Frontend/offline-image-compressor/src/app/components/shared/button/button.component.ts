import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IconDefinition,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  public buttonText = '';

  @Input()
  set text(name: string) {
    this.buttonText = name.toUpperCase();
  }
  get name(): string {
    return this.buttonText;
  }

  @Input() icon: IconDefinition = faArrowsRotate;
  @Input() color: string = '0068B4';
  @Input() type: string = 'button';
  @Output() btnClick = new EventEmitter();
  @Input() isDisabled = false;

  constructor() {}

  ngOnInit() {}

  onClick() {
    this.btnClick.emit();
  }
}
