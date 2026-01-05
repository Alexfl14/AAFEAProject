import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  // EmailJS credentials from environment
  private readonly SERVICE_ID = environment.emailjs.serviceId;
  private readonly TEMPLATE_ID = environment.emailjs.templateId;
  private readonly PUBLIC_KEY = environment.emailjs.publicKey;

  contactForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern('^[- +()0-9]{10,}$')],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitError = false;

      // Prepare template parameters matching your form fields
      const templateParams = {
        firstName: this.contactForm.value.firstName,
        lastName: this.contactForm.value.lastName,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone || 'Not provided',
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message
      };

      // Send email using EmailJS
      emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      ).then(
        (response) => {
          console.log('Email sent successfully!', response.status, response.text);
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.contactForm.reset();

          // Hide success message after 5 seconds
          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        },
        (error) => {
          console.error('Failed to send email:', error);
          this.isSubmitting = false;
          this.submitError = true;
          this.errorMessage = 'Failed to send message. Please try again later.';

          // Hide error message after 5 seconds
          setTimeout(() => {
            this.submitError = false;
          }, 5000);
        }
      );
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
