import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private readonly _sidebarOpen = signal(false);
  private readonly _darkMode = signal<boolean>(this._resolveInitialTheme());

  readonly sidebarOpen = this._sidebarOpen.asReadonly();
  readonly darkMode = this._darkMode.asReadonly();

  constructor() {
    this._applyTheme();
  }

  toggleSidebar(): void {
    this._sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this._sidebarOpen.set(false);
  }

  openSidebar(): void {
    this._sidebarOpen.set(true);
  }

  toggleDarkMode(): void {
    const isDark = !this._darkMode();
    this._darkMode.set(isDark);
    this._persistTheme(isDark);
    this._applyTheme();
  }

  private _applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    if (this._darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private _resolveInitialTheme(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      return true;
    }

    if (storedTheme === 'light') {
      return false;
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  private _persistTheme(isDark: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
