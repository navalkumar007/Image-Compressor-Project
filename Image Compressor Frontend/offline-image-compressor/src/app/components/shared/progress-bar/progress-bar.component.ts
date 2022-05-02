import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  //For styling the component
  @Input() barWidth: string = '0% ';
  @Input() barHeight: string = '30px';
  @Input() marginTop: string = '1rem';
  @Input() showTxtLabel: boolean = true;
  @Input() barColor: string = '#2196f3';

  constructor() { }

  ngOnInit() {
  }

}
