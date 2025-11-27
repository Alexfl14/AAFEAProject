import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { FooterComponent } from './core/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);

  ngOnInit(): void {
    // Set up translations
    const enTranslations = {
      nav: {
        home: 'Home',
        findSitter: 'Find a Sitter',
        createAd: 'Create Ad',
        about: 'About Us',
        contact: 'Contact',
        faq: 'FAQ'
      },
      footer: {
        copyright: '© 2025 Pet Sitter. All rights reserved.',
        followUs: 'Follow us on'
      },
      home: {
        title: 'Welcome to Pet Sitter',
        subtitle: 'Find trusted pet sitters in your area'
      }
    };

    const roTranslations = {
      nav: {
        home: 'Acasă',
        findSitter: 'Găsește un Îngrijitor',
        createAd: 'Creează Anunț',
        about: 'Despre Noi',
        contact: 'Contact',
        faq: 'Întrebări Frecvente'
      },
      footer: {
        copyright: '© 2025 Pet Sitter. Toate drepturile rezervate.',
        followUs: 'Urmărește-ne pe'
      },
      home: {
        title: 'Bine ai venit la Pet Sitter',
        subtitle: 'Găsește îngrijitori de încredere în zona ta'
      }
    };

    this.translateService.setTranslation('en', enTranslations);
    this.translateService.setTranslation('ro', roTranslations);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
}
