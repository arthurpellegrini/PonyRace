import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerDebugMessage: string = '';
  messageType: string = '';
  years: number[] = [];

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      registerUsername: ['', Validators.required],
      registerPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      birthYear: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.initializeYears();
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
      this.years.push(year);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('registerPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { registerUsername, registerPassword, birthYear } = this.registerForm.value;
      this.authService.register(registerUsername, registerPassword, birthYear).subscribe(
        success => {
          if (success) {
            this.registerDebugMessage = 'Registration successful';
            this.messageType = 'success';
            this.router.navigate(['/races']);
          } else {
            this.registerDebugMessage = 'Registration failed';
            this.messageType = 'error';
          }
        },
        error => {
          this.registerDebugMessage = error;
          this.messageType = 'error';
        }
      );
    } else if (this.registerForm.hasError('mismatch')) {
      this.registerDebugMessage = 'Les mots de passe ne correspondent pas.';
      this.messageType = 'error';
    }
  }

  getMessageClass(): string {
    return this.messageType === 'success' ? 'alert-success' : 'alert-danger';
  }
}
