import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'instructions-dialog',
    templateUrl: './instructions-dialog.component.html',
    styleUrls: ['./instructions-dialog.component.scss']
})
export class InstructionsDialogComponent {



      constructor(
 public dialogRef: MatDialogRef<InstructionsDialogComponent>) {


      }





      close(): void {
 this.dialogRef.close();
 }
}
