import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginDebugMessage: string = '';
  messageType: string = '';

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      loginUsername: ['', Validators.required],
      loginPassword: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { loginUsername, loginPassword } = this.loginForm.value;
      this.authService.login(loginUsername, loginPassword).subscribe(
        success => {
          if (success) {
            this.loginDebugMessage = 'Login successful';
            this.messageType = 'success';
            this.router.navigate(['/races']);
          } else {
            this.loginDebugMessage = 'Invalid username or password';
            this.messageType = 'error';
          }
        },
        error => {
          this.loginDebugMessage = error;
          this.messageType = 'error';
        }
      );
    }
  }

  getMessageClass(): string {
    return this.messageType === 'success' ? 'alert-success' : 'alert-danger';
  }
}
