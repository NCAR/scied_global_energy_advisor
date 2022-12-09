import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { SourcesDialogComponent } from '../sources-dialog/sources-dialog.component';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  sourcesDialog: MatDialogRef<SourcesDialogComponent>;
  constructor(private dialogModel: MatDialog, private dialog: MatDialog ) { }

  ngOnInit(): void {
  }

  /**
  *
  *
  **/
  public openSourcesDialog() {
 this.sourcesDialog = this.dialogModel.open(SourcesDialogComponent);
  }

}
