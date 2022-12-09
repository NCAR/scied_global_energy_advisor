import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'sources-dialog',
    templateUrl: './sources-dialog.component.html',
    styleUrls: ['./sources-dialog.component.scss']
})
export class SourcesDialogComponent {



      constructor(
 public dialogRef: MatDialogRef<SourcesDialogComponent>) {


      }





      close(): void {
 this.dialogRef.close();
 }
}
