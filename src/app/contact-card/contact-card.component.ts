import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contact } from '../contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss']
})
export class ContactCardComponent {
  @Input() contact!: Contact;
  @Output() delete = new EventEmitter<Contact>();  // Emit event to parent for delete
  @Output() edit = new EventEmitter<Contact>();    // Emit event to parent for edit

  

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  // Edit the contact and set the form in Edit Mode
  onEdit(): void {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: '400px',
      data: { contact: { ...this.contact }, isEditMode: true } // Pass contact and set isEditMode to true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Changes saved', 'Close', { duration: 3000 });
        this.edit.emit(result);  // Emit the updated contact back to the parent
      }
    });
  }

  // Emit the delete event to parent
  onDelete(): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      console.log('Deleting contact with id:', this.contact.id);  // Add this to check the contact id
      this.delete.emit(this.contact);  // Emit the contact to be deleted to the parent component
    }
  }

  goToDetails(contactId: string | undefined): void {
    if (contactId) {
      this.router.navigate([`/contacts/${contactId}`]); // Navigate to the details page
    }
  }
}
