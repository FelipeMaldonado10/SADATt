
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  loading = false;
  errorMsg = '';
  successMsg = '';
  editUserId: string | null = null;
  editForm: any = {};

  registerForm: FormGroup;
  regLoading = false;
  regSuccessMsg = '';
  regErrorMsg = '';
  regRoles = [
    { value: 'client', label: 'Cliente' },
    { value: 'integral', label: 'Microempresa Integral' },
    { value: 'satellite', label: 'Microempresa Satélite' },
    { value: 'admin', label: 'Administrador' }
  ];

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client', Validators.required]
    });
  }
  registerUser() {
    this.regSuccessMsg = '';
    this.regErrorMsg = '';
    if (this.registerForm.invalid) {
      this.regErrorMsg = 'Por favor completa todos los campos correctamente.';
      return;
    }
    this.regLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.regSuccessMsg = res.message || 'Usuario registrado exitosamente.';
        this.registerForm.reset();
        this.regLoading = false;
        this.getUsers();
      },
      error: (err) => {
        this.regErrorMsg = err.error?.message || 'Error al registrar usuario.';
        this.regLoading = false;
      }
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.errorMsg = '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    this.http.get<any[]>('http://localhost:5000/api/admin/users', { headers }).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al obtener usuarios.';
        this.loading = false;
      }
    });
  }

  startEdit(user: any) {
    this.editUserId = user._id;
    this.editForm = { name: user.name, email: user.email, role: user.role, status: user.status };
  }

  cancelEdit() {
    this.editUserId = null;
    this.editForm = {};
  }

  saveEdit(userId: string) {
    this.successMsg = '';
    this.errorMsg = '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    this.http.put(`http://localhost:5000/api/admin/users/${userId}`, this.editForm, { headers }).subscribe({
      next: (user) => {
        this.successMsg = 'Usuario actualizado correctamente.';
        this.getUsers();
        this.cancelEdit();
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al actualizar usuario.';
      }
    });
  }

  deleteUser(userId: string) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    this.successMsg = '';
    this.errorMsg = '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    this.http.delete(`http://localhost:5000/api/admin/users/${userId}`, { headers }).subscribe({
      next: () => {
        this.successMsg = 'Usuario eliminado correctamente.';
        this.getUsers();
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al eliminar usuario.';
      }
    });
  }
}
