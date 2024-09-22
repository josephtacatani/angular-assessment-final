import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from '../contact.service';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { Contact } from '../contact.model';
import { Router } from '@angular/router';
import { CustomSnackBarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-contact-table',
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.scss']
})
export class ContactTableComponent {
  @Input() contacts!: Contact[];  // Receive the contacts array from the parent
  @Output() delete = new EventEmitter<Contact>();  // Emit event to parent for delete

  constructor(
    private contactService: ContactService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  // Edit the contact and set the form in Edit Mode
  onEdit(contact: Contact): void {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: '400px',
      data: { contact: { ...contact }, isEditMode: true }  // Pass the contact and set isEditMode to true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Call the service to update the contact
        this.contactService.updateContact(result).subscribe((updatedContact: Contact) => {
          // Find the contact in the list and update it
          const index = this.contacts.findIndex(c => c.id === updatedContact.id);
          if (index !== -1) {
            this.contacts[index] = updatedContact;  // Update the contact in the table
            this.snackBar.openFromComponent(CustomSnackBarComponent, {
              duration: 3000,
              data: 'Changes saved',
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            });
          }
        }, error => {
          console.error('Error updating contact:', error);
          this.snackBar.openFromComponent(CustomSnackBarComponent, {
            duration: 3000,
            data: 'Error saving changes',
            panelClass: ['custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        });
      }
    });
  }

  // Emit the delete event to the parent component
  onDelete(contact: Contact): void {
    console.log(contact);
    if (confirm('Are you sure you want to delete this contact?')) {
      this.delete.emit(contact);  // Emit the contact to be deleted to the parent component
    }
  }

  goToDetails(contactId: string | undefined): void {
    if (contactId) {
      this.router.navigate([`/contacts/${contactId}`]); // Navigate to the details page
    }
  }

  
}
