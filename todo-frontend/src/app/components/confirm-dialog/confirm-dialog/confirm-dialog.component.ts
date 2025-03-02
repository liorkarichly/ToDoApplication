import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../modules/material/material.module';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
