import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly STORAGE_KEY = 'darkMode';
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initializeDarkMode();
  }

  private initializeDarkMode(): void {
    const savedMode = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedMode ? savedMode === 'true' : prefersDark;

    this.isDarkMode.set(isDark);
    this.updateDarkModeClass(isDark);
  }

  toggleDarkMode(): void {
    const newValue = !this.isDarkMode();
    this.isDarkMode.set(newValue);
    this.updateDarkModeClass(newValue);
    localStorage.setItem(this.STORAGE_KEY, String(newValue));
  }

  private updateDarkModeClass(isDark: boolean): void {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
