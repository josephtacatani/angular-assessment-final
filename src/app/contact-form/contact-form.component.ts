import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContactFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // `data` now contains both contact and isEditMode
  ) {
    this.isEditMode = data.isEditMode;  // Set Edit Mode based on the passed data

    // Initialize form
    this.contactForm = this.fb.group({
      id: [data.contact?.id || null],  // Use existing contact data or default to null for new contact
      name: [data.contact?.name || '', [Validators.required]],
      email: [data.contact?.email || '', [Validators.required, this.validateEmail]],
      contactNumber: [
        data.contact?.contactNumber || '', 
        [Validators.required, Validators.maxLength(11), Validators.pattern(/^\d{1,11}$/)]
      ]
    });
  }

  ngOnInit(): void {}

  // Custom email validator
  validateEmail(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) {
      return null;
    }
    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!validEmailRegex.test(email)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.contactForm.valid) {
      this.dialogRef.close(this.contactForm.value);  // Close dialog and return form value
    }
  }

  // Handle dialog cancellation
  onCancel(): void {
    this.dialogRef.close();  // Just close the dialog without returning any data
  }

  // Limit input to 11 digits
  onContactNumberInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 11);
    this.contactForm.get('contactNumber')?.setValue(input.value);
  }
}
