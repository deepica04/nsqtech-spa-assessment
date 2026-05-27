import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { RecordService, Record } from '../../core/services/record.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;

  users: User[] = [];
  records: Record[] = [];

  isLoadingUsers = true;
  isLoadingRecords = true;

  userError = '';
  recordError = '';
  successMessage = '';

  activeTab: 'records' | 'users' = 'records';

  // Modal state
  showCreateModal = false;
  showEditModal = false;
  selectedUser: User | null = null;

  createForm!: FormGroup;
  editForm!: FormGroup;

  roles = ['General User', 'Admin'];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private recordService: RecordService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.initForms();
    this.loadUsers();
    this.loadRecords();
  }

  private initForms(): void {
    this.createForm = this.fb.group({
      userId:     ['', [Validators.required, Validators.minLength(3)]],
      name:       ['', Validators.required],
      email:      ['', [Validators.required, Validators.email]],
      password:   ['', [Validators.required, Validators.minLength(6)]],
      role:       ['General User', Validators.required],
      department: ['General', Validators.required],
    });

    this.editForm = this.fb.group({
      name:       ['', Validators.required],
      role:       ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => { this.users = res.users; this.isLoadingUsers = false; },
      error: () => { this.userError = 'Failed to load users.'; this.isLoadingUsers = false; },
    });
  }

  loadRecords(): void {
    this.isLoadingRecords = true;
    this.recordService.getRecords(1000).subscribe({
      next: (res) => { this.records = res.records; this.isLoadingRecords = false; },
      error: () => { this.recordError = 'Failed to load records.'; this.isLoadingRecords = false; },
    });
  }

  openCreateModal(): void {
    this.createForm.reset({ role: 'General User', department: 'General' });
    this.showCreateModal = true;
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue({ name: user.name, role: user.role, department: user.department });
    this.showEditModal = true;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedUser = null;
  }

  submitCreate(): void {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }

    this.userService.createUser(this.createForm.value).subscribe({
      next: () => {
        this.showSuccess('User created successfully!');
        this.closeModals();
        this.loadUsers();
      },
      error: (err) => { this.userError = err.error?.message || 'Failed to create user.'; },
    });
  }

  submitEdit(): void {
    if (this.editForm.invalid || !this.selectedUser) return;

    this.userService.updateUser(this.selectedUser.userId, this.editForm.value).subscribe({
      next: () => {
        this.showSuccess('User updated successfully!');
        this.closeModals();
        this.loadUsers();
      },
      error: (err) => { this.userError = err.error?.message || 'Failed to update user.'; },
    });
  }

  deleteUser(userId: string): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.showSuccess('User deleted.');
        this.loadUsers();
      },
      error: (err) => { this.userError = err.error?.message || 'Failed to delete user.'; },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  get cf() { return this.createForm.controls; }
  get ef() { return this.editForm.controls; }

  get activeRecords()  { return this.records.filter(r => r.status === 'Active').length; }
  get adminCount()     { return this.users.filter(u => u.role === 'Admin').length; }
  get generalCount()   { return this.users.filter(u => u.role === 'General User').length; }
}
