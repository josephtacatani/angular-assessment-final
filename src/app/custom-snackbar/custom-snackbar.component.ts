// custom-snackbar.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  template: `
    <div class="snackbar-content">
      <mat-icon>check</mat-icon>
      <span>{{ data }}</span>
    </div>
  `,
  styles: [`
    .snackbar-content {
      display: flex;
      align-items: center;
      color: black;
      background-color: #43F7CC;
      height: 10px;
      border-radius: 7px;
      font-size: 15px;
      box-shadow: none;
    }
    .snackbar-content span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    mat-icon {
      margin-right: 8px;
      color: black;
  }
  `]
})
export class CustomSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
