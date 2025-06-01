import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  users: any[] = [];
  showDialog = false;
  isEditMode = false;
  selectedUserId: string | null = null;

  userData = {
    name: '',
    age: null,
    email: '',
    gender: '',
    password: '',
  };

  // Pagination
  currentPage = 1;
  pageSize = 5;

  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.http.get<any[]>('http://localhost:5000/api/users').subscribe((data) => {
      this.users = data;
      this.sortColumn = '';
      this.currentPage = 1;
    });
  }

  get sortedUsers() {
    if (!this.sortColumn) return this.users;

    return [...this.users].sort((a, b) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return this.sortDirection === 'asc'
          ? valA - valB
          : valB - valA;
      }
    });
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedUsers.slice(start, start + this.pageSize);
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  addUser() {
    this.showDialog = true;
    this.isEditMode = false;
    this.resetForm();
  }

  editUser(user: any) {
    this.userData = { ...user };
    this.selectedUserId = user._id;
    this.isEditMode = true;
    this.showDialog = true;
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:5000/api/users/${userId}`).subscribe(() => {
        this.getAllUsers();
      });
    }
  }

  closeDialog() {
    this.showDialog = false;
  }

  saveUser() {
    const apiUrl = 'http://localhost:5000/api/users';

    if (this.isEditMode && this.selectedUserId) {
      this.http.put(`${apiUrl}/${this.selectedUserId}`, this.userData).subscribe(() => {
        this.getAllUsers();
        this.closeDialog();
      });
    } else {
      this.http.post(apiUrl, this.userData).subscribe(() => {
        this.getAllUsers();
        this.closeDialog();
      });
    }
  }

  resetForm() {
    this.userData = {
      name: '',
      age: null,
      email: '',
      gender: '',
      password: '',
    };
    this.selectedUserId = null;
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.users.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
