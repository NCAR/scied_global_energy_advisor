import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SourcesDialogComponent } from '../sources-dialog/sources-dialog.component';

@Component({
    selector: 'instructions-dialog',
    templateUrl: './instructions-dialog.component.html',
    styleUrls: ['./instructions-dialog.component.scss']
})
export class InstructionsDialogComponent {


    sourcesDialog: MatDialogRef<SourcesDialogComponent>;
      constructor(private dialogModel: MatDialog, private dialog: MatDialog,
 public dialogRef: MatDialogRef<InstructionsDialogComponent>) {


      }



      /**
      *
      *
      **/
      public openSourcesDialog() {
     this.sourcesDialog = this.dialogModel.open(SourcesDialogComponent);
      }

      close(): void {
 this.dialogRef.close();
 }
}
