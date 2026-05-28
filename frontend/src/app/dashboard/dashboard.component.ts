import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';
import { RecordService, Record } from '../../core/services/record.service';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userDetails: User | null = null;
  records: Record[] = [];
  filteredRecords: Record[] = [];

  isLoadingRecords = true;
  isLoadingUser = true;
  loadError = '';

  // Filter state
  statusFilter = 'All';
  priorityFilter = 'All';
  searchQuery = '';

  statusOptions = ['All', 'Active', 'Pending', 'Closed'];
  priorityOptions = ['All', 'High', 'Medium', 'Low'];

  // Stats
  get activeCount()  { return this.records.filter(r => r.status === 'Active').length; }
  get pendingCount() { return this.records.filter(r => r.status === 'Pending').length; }
  get highPriCount() { return this.records.filter(r => r.priority === 'High').length; }

  constructor(
    private authService: AuthService,
    private recordService: RecordService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadUserDetails();
    this.loadRecords();
  }

  private loadUserDetails(): void {
    this.isLoadingUser = true;
    this.userService.getMe().subscribe({
      next: (res) => {
        this.userDetails = res.user;
        this.isLoadingUser = false;
      },
      error: () => {
        this.isLoadingUser = false;
      },
    });
  }

  private loadRecords(): void {
    this.isLoadingRecords = true;
    this.loadError = '';

    // Uses delay to demonstrate async processing (as required)
    this.recordService.getRecords(environment.recordDelay).subscribe({
      next: (res) => {
        this.records = res.records;
        this.applyFilters();
        this.isLoadingRecords = false;
      },
      error: (_err) => {
        this.loadError = err.error?.message || 'Failed to load records.';
        this.isLoadingRecords = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.records];

    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(r => r.status === this.statusFilter);
    }

    if (this.priorityFilter !== 'All') {
      filtered = filtered.filter(r => r.priority === this.priorityFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
      );
    }

    this.filteredRecords = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  refreshRecords(): void {
    this.loadRecords();
  }

  logout(): void {
    this.authService.logout();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
