import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber, map } from 'rxjs';
import { FileModel } from 'src/app/models/file-model';
import { FileCompressionService } from 'src/app/services/file-compression.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'img-dropzone',
  templateUrl: './img-dropzone.component.html',
  styleUrls: ['./img-dropzone.component.scss'],
})
export class ImgDropzoneComponent implements OnInit {
  uploadedImg!: Observable<any>;
  downloadImg!: Observable<any>;
  uploadedfileName!: string;
  currentfileSize!: string;
  uploadBarWidth: string = '0% ';
  downloadedfileName!: string;
  downloadFileSize: string = '0';
  downloadBarWidth: string = '0% ';
  showDownloadSection: Boolean = false;
  faArrowsRotate = faArrowsRotate;

  constructor(private compressionService: FileCompressionService) {}

  ngOnInit() {}

  onChange = ($event: Event) => {
    //Capture the event property
    const target = $event.target as HTMLInputElement;

    //First index in FileList since we're getting only 1 file
    const file: File = (target.files as FileList)[0];

    //Get the file type
    //Specifically extract jpg or png if type contains image/jpg or image/png
    //Otherwise get the extension of error file if it contains / or give it a value of unknown
    var fileType: string = file.type.includes('image/')
      ? file.type.replace('image/', '')
      : file.type.includes('/')
      ? file.type.substring(file.type.lastIndexOf('/') + 1)
      : 'Unknown';

    //Validate file type
    if (target.files && target.files.length > 0) {
      // Don't allow files of other types
      if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png') {
        //Get the image file object from event and upload to server
        this.compressFile(file);
      } else {
        // Display error message
        this.alertPopUp(
          'Invalid File Detected',
          'Type: ' + fileType + ' is not allowed.',
          'error'
        );
      }
    }
  };

  //Method for uploading file to server for compression
  private compressFile(file: File) {
    let fileToUpload = new FileModel();

    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });

    observable.subscribe((fileData) => {
      //Setting the file properties
      //base64 representation
      this.uploadedImg = fileData;
      //Label data for view
      this.uploadedfileName = file.name;

      //Convert size to readable string
      this.currentfileSize = this.bytesToMB(file.size);

      //For server upload
      fileToUpload.fileAsBase64 = fileData;
      fileToUpload.fileName = file.name;
      fileToUpload.fileSize = file.size;
      fileToUpload.fileType = file.type;

      //Post to server
      this.compressionService.compressFile(fileToUpload).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadBarWidth =
              Math.round((100 / (event.total || 0)) * event.loaded) + '%';
          }
          if (event.type === HttpEventType.Response) {
            if (event.body.fileForDownload) {
              this.showDownloadSection = true;
              this.downloadBarWidth = '100%';

              //Response data
              const fileObj = event.body.fileForDownload;

              //Set the base64 representation
              const imgFileBase64 = fileObj['fileAsBase64'];
              this.downloadImg = imgFileBase64;

              //File naming
              const imgFileName = this.removeFileExt(fileObj['fileName']);
              const imgFileExt = this.getFileExt(fileObj['fileName']);

              //File size
              const compressedImgFileSize = fileObj['fileSize'];
              this.downloadFileSize = this.bytesToMB(compressedImgFileSize);

              //Set the converted file name
              const fileName: string = imgFileName + '_Converted.' + imgFileExt;
              this.downloadedfileName = fileName;

              var reader = new FileReader();
              fetch(imgFileBase64).then(async function (res) {
                //Convert base64 to blob file
                const downloadedFile = await res.blob();
                reader.readAsDataURL(downloadedFile);
                //Auto download the file
                reader.onload = (_) => {
                  const a = document.createElement('a');
                  a.setAttribute('style', 'display:none');
                  document.body.appendChild(a);
                  a.download = fileName;
                  a.href = URL.createObjectURL(downloadedFile);
                  a.target = '_blank';
                  a.click();
                  document.body.removeChild(a);
                };
              });

              //Compute compression percentage
              let uploadedFileSize = file.size;
              let percentageCompBy = this.computeCompressionPercentage(
                uploadedFileSize,
                compressedImgFileSize
              );

              this.alertPopUp(
                'Compression Complete',
                'File has been compressed by ' +
                  parseFloat(percentageCompBy.toString()).toFixed(2) +
                  '%',
                'success'
              );
            } else {
              this.alertPopUp(
                'Server Response Error',
                'Could not download compressed file from server',
                'error'
              );
            }
          }
        },
        error: (_err) => {
          this.uploadBarWidth = '0%';
          this.alertPopUp(
            'File Upload Error',
            'Could not upload file',
            'error'
          );
        },
      });
    });
  }

  //Refresh page
  reloadCurrentPage() {
    window.location.reload();
  }

  //Method for calculating compression percentage
  private computeCompressionPercentage(
    uploadFileSize: number,
    compressedImgSize: number
  ) {
    const fileSizeDecrease = uploadFileSize - compressedImgSize;
    return (fileSizeDecrease / uploadFileSize) * 100;
  }

  //Method for reading file
  private readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();

    //Converting file to base64
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    };

    //For error checking
    fileReader.onerror = () => {
      subscriber.error();
      subscriber.complete();
    };
  }

  // Method for removing extensions from file name
  private removeFileExt(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, '');
  }

  //Method for getting file extensions from file name
  private getFileExt(fileName: string) {
    return fileName.split('.').pop();
  }

  //Method for displaying pop up error messages
  private alertPopUp(title: string, message: string, icon: SweetAlertIcon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: message,
    });
  }

  //Method for converting bytes to MB
  //Special thanks: Deathwebo - https://gist.github.com/lanqy/5193417?permalink_comment_id=2663632#gistcomment-2663632
  private bytesToMB(bytes: number): string {
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i: number = parseInt(
      Math.floor(Math.log(bytes) / Math.log(1024)).toString()
    );
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }
}
