# Pet Sitter App - Project Overview

## 🎯 Features Implemented

### ✅ Core Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode** - Toggle between light and dark themes with persistence in localStorage
- **Multi-language Support** - EN/RO translation using ngx-translate
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Lazy Loading** - All routes are lazy-loaded for optimal performance

### 📱 Components

#### Navbar Component
Location: [src/app/core/components/navbar](src/app/core/components/navbar/)

Features:
- Logo with pet paw emoji 🐾
- Responsive navigation links
- Dark mode toggle button (🌙/☀️)
- Language switcher (EN/RO)
- Mobile hamburger menu
- Active route highlighting

#### Footer Component
Location: [src/app/core/components/footer](src/app/core/components/footer/)

Features:
- Logo and description
- Social media links
- Copyright information
- Responsive layout

### 🛣️ Routing Structure

All routes use lazy loading for better performance:

```typescript
/home              → Home page (hero, features, CTA)
/find-sitter       → Browse pet sitters (to be implemented)
/create-ad         → Create a new ad (to be implemented)
/job-details/:id   → View job details (to be implemented)
/about             → About us page (to be implemented)
/contact           → Contact page (to be implemented)
/faq               → FAQ page (to be implemented)
```

### 🎨 Styling & Theming

#### CSS Variables
The app uses CSS custom properties for easy theming:

**Light Mode:**
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Background: `#ffffff` / `#f8fafc`

**Dark Mode:**
- Primary: `#818cf8` (Light Indigo)
- Secondary: `#a78bfa` (Light Purple)
- Background: `#0f172a` / `#1e293b`

#### Global Styles
Location: [src/styles.scss](src/styles.scss)

Includes:
- CSS variables for theming
- Typography system
- Button styles
- Utility classes
- Responsive breakpoints
- Custom scrollbar styling

### 🌐 Internationalization (i18n)

**Supported Languages:**
- English (EN)
- Romanian (RO)

**Translation Keys:**
```json
{
  "nav": { "home", "findSitter", "createAd", "about", "contact", "faq" },
  "footer": { "copyright", "followUs" },
  "home": { "title", "subtitle" }
}
```

### 🔧 Services

#### Dark Mode Service
Location: [src/app/core/services/dark-mode.service.ts](src/app/core/services/dark-mode.service.ts)

Features:
- Signal-based reactivity
- localStorage persistence
- System preference detection
- Automatic class toggling on `<html>` element

## 🏗️ Project Structure

```
pet-sitter-app/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   │   ├── navbar.component.ts
│   │   │   │   │   ├── navbar.component.html
│   │   │   │   │   └── navbar.component.scss
│   │   │   │   └── footer/
│   │   │   │       ├── footer.component.ts
│   │   │   │       ├── footer.component.html
│   │   │   │       └── footer.component.scss
│   │   │   └── services/
│   │   │       └── dark-mode.service.ts
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── find-sitter/
│   │   │   ├── create-ad/
│   │   │   ├── job-details/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── faq/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── styles.scss
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Development Server
```bash
cd pet-sitter-app
npm install
ng serve
```
Navigate to `http://localhost:4200/`

### Build
```bash
ng build
```
Build artifacts will be stored in the `dist/` directory.

### Build for Production
```bash
ng build --configuration production
```

## 📋 Next Steps

To complete the pet sitter app, you'll need to:

1. **Implement remaining pages:**
   - Find Sitter (with filters for services, location)
   - Create Ad form
   - Job Details template
   - About Us content
   - Contact form
   - FAQ with accordion

2. **Add features:**
   - API integration for pet info
   - Local storage for favorite ads (starred items)
   - Service filters (daycare, training, walking)
   - Location-based search
   - User authentication (optional)

3. **Enhance functionality:**
   - Form validation
   - Loading states
   - Error handling
   - Toast notifications
   - Image uploads

## 🛠️ Technologies Used

- **Angular 19** - Latest version with standalone components
- **TypeScript** - Type-safe development
- **SCSS** - Advanced styling with variables and nesting
- **ngx-translate** - Internationalization
- **RxJS** - Reactive programming (built into Angular)
- **Angular Signals** - Modern state management

## 📱 Responsive Breakpoints

- Desktop: `> 968px`
- Tablet: `768px - 968px`
- Mobile: `< 768px`

## 🎨 Design Principles

1. **Modern & Clean** - Minimalist design with focus on usability
2. **Accessible** - ARIA labels, semantic HTML, keyboard navigation
3. **Performant** - Lazy loading, optimized bundles, CSS variables
4. **User-Friendly** - Intuitive navigation, clear CTAs, smooth transitions
5. **Responsive** - Mobile-first approach with adaptive layouts

---

**Built with ❤️ using Angular**
