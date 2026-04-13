import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@users/models/user.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
  private readonly auth = inject(AuthService);

  readonly loading = signal(true);
  readonly user = signal<User | null>(null);

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (u: User) => { this.user.set(u); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
