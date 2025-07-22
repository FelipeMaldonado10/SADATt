
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';
  roles = [
    { value: 'client', label: 'Cliente' },
    { value: 'integral', label: 'Microempresa Integral' },
    { value: 'satellite', label: 'Microempresa Satélite' }
  ];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client', Validators.required]
    });
  }

  submit() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.registerForm.invalid) {
      this.errorMsg = 'Por favor completa todos los campos correctamente.';
      return;
    }
    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.successMsg = res.message || 'Registro exitoso. Revisa tu correo.';
        this.registerForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error en el registro.';
        this.loading = false;
      }
    });
  }
}
