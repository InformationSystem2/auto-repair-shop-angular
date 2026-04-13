import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { UIService } from '@core/services/ui.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard Admin',   icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', route: '/app/admin/dashboard',    roles: ['admin'] },
  { label: 'Dashboard Taller',  icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 8h2',                                       route: '/app/workshop/dashboard', roles: ['workshop_owner'] },
  { label: 'Dashboard Técnico', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',          route: '/app/technician/dashboard', roles: ['technician'] },
  { label: 'Usuarios',          icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197',                                                               route: '/app/users',              roles: ['admin', 'workshop_owner'] },
  { label: 'Roles',             icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', route: '/app/roles', roles: ['admin'] },
  { label: 'Mi Perfil',         icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',          route: '/app/profile',           roles: ['admin', 'workshop_owner', 'technician'] },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);
  readonly uiService = inject(UIService);

  readonly userName = this.auth.currentUserName;
  readonly initials = computed(() => {
    const name = this.auth.currentUserName() ?? '?';
    return name.slice(0, 2).toUpperCase();
  });
  readonly roleName = computed(() => this.auth.roles()[0]?.name ?? '');

  readonly visibleItems = computed(() => {
    const userRoles = this.auth.roles().map((r) => r.name);
    return NAV_ITEMS.filter((item) =>
      item.roles.some((r) => userRoles.includes(r))
    );
  });
}
