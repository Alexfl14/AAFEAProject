import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  darkModeService = inject(DarkModeService);
  private translateService = inject(TranslateService);

  isMenuOpen = false;
  currentLang = 'en';

  constructor() {
    this.currentLang = this.translateService.currentLang || this.translateService.defaultLang || 'en';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translateService.use(lang);
  }
}
