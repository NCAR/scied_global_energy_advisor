import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleChartModule } from './google-chart/google-chart.module';

import { HttpClientModule } from '@angular/common/http';
import { IntroductionComponent } from './introduction/introduction.component';
import { ResultsComponent } from './results/results.component';
import { InteractiveComponent } from './interactive/interactive.component';
import { InstructionsDialogComponent } from './instructions/instructions-dialog.component';
import { SourcesDialogComponent } from './sources-dialog/sources-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip'

@NgModule({
  declarations: [
    AppComponent,
    IntroductionComponent,
    ResultsComponent,
    InteractiveComponent,
    InstructionsDialogComponent,
    SourcesDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleChartModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [InstructionsDialogComponent]
})
export class AppModule { }
