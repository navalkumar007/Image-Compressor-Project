import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileModel } from '../models/file-model';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/compressImg`;

@Injectable({
  providedIn: 'root',
})
export class FileCompressionService {
  constructor(private http: HttpClient) {}

  //Post file to server for compression
  compressFile(imgFile: FileModel): Observable<HttpEvent<any>> {
    return this.http.post<FileModel>(API_URL, imgFile, {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
