import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { CustomSnackBarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  isCardView: boolean = true;

  constructor(
    private contactService: ContactService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getContacts();
  }

  // Fetch contacts from the server
  getContacts(): void {
    this.contactService.getContacts().subscribe((data: Contact[]) => {
      this.contacts = data;
    });
  }

  // Toggle between card and table views
  toggleView(view: string): void {
    this.isCardView = view === 'card';
  }

  // Open the form to add a new contact
  openContactForm(): void {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: '400px',
      data: {}  // Pass an empty object for a new contact
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.addContact(result).subscribe((newContact: Contact) => {
          this.contacts.push(newContact);  // Add the new contact to the list
          this.snackBar.openFromComponent(CustomSnackBarComponent, {
            duration: 3000,
            data: 'Successfully added a new contact!',
            panelClass: ['custom-snackbar'],  // Ensure this matches your SCSS class
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        });
      }
    });
  }

  // Handle edit event from ContactCardComponent
  onEditContact(updatedContact: Contact): void {
    this.contactService.updateContact(updatedContact).subscribe(
      (response: Contact) => {
        const index = this.contacts.findIndex(c => c.id === response.id);
        if (index !== -1) {
          this.contacts[index] = response;  // Update the contact in the list
          this.snackBar.openFromComponent(CustomSnackBarComponent, {
            duration: 3000,
            data: 'Changes saved',
            panelClass: ['custom-snackbar'],  // Ensure this matches your SCSS class
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      },
      error => {
        console.error('Error updating contact:', error);
        this.snackBar.openFromComponent(CustomSnackBarComponent, {
          duration: 3000,
          data: 'Error updating contact',
          panelClass: ['custom-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    );
  }

  // Handle delete event from ContactCardComponent
// ContactListComponent.ts
deleteContact(contact: Contact): void {
  if (contact.id) {
    this.contactService.deleteContact(contact.id).subscribe(() => {
      this.contacts = this.contacts.filter(c => c.id !== contact.id);
      this.snackBar.openFromComponent(CustomSnackBarComponent, {
        duration: 3000,
        data: 'Successfully deleted the contact!',
        panelClass: ['custom-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }, error => {
      console.error('Error deleting contact:', error);
      this.snackBar.openFromComponent(CustomSnackBarComponent, {
        duration: 3000,
        data: 'Error deleting contact',
        panelClass: ['custom-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    });
  } else {
    console.error('Contact ID is missing or null', contact);
  }
}

  
}
