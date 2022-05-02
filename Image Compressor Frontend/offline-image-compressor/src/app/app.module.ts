import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { ConvertedImgComponent } from './components/converted-img/converted-img.component';
import { FooterComponent } from './components/shared/footer/footer.component';

import { HeaderComponent } from './components/shared/header/header.component';
import { ImgDropzoneComponent } from './components/img-dropzone/img-dropzone.component';
import { ProgressBarComponent } from './components/shared/progress-bar/progress-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ImgDropzoneComponent,
    ProgressBarComponent,
    ConvertedImgComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
