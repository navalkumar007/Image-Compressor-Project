import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-converted-img',
  templateUrl: './converted-img.component.html',
  styleUrls: ['./converted-img.component.scss']
})
export class ConvertedImgComponent implements OnInit {
  @Input() downloadImg!: Observable<any>;
  @Input() downloadBarWidth: string = '0% ';
  @Input() downloadedFileName: string = 'FileName';
  @Input() downloadedFileSize: string = '0';

  constructor() { }

  ngOnInit() {
  }

}
