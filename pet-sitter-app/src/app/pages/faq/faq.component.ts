import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface FaqItem {
  id: string;
  category: 'forOwners' | 'forSitters' | 'general';
  questionKey: string;
  answerKey: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  searchQuery = signal<string>('');
  
  // FAQ items organized by category
  faqItems = signal<FaqItem[]>([
    // For Pet Owners
    {
      id: 'howItWorks',
      category: 'forOwners',
      questionKey: 'faq.questions.howItWorks.q',
      answerKey: 'faq.questions.howItWorks.a',
      isOpen: false
    },
    {
      id: 'cost',
      category: 'forOwners',
      questionKey: 'faq.questions.cost.q',
      answerKey: 'faq.questions.cost.a',
      isOpen: false
    },
    {
      id: 'safety',
      category: 'forOwners',
      questionKey: 'faq.questions.safety.q',
      answerKey: 'faq.questions.safety.a',
      isOpen: false
    },
    {
      id: 'booking',
      category: 'forOwners',
      questionKey: 'faq.questions.booking.q',
      answerKey: 'faq.questions.booking.a',
      isOpen: false
    },
    {
      id: 'cancellation',
      category: 'general',
      questionKey: 'faq.questions.cancellation.q',
      answerKey: 'faq.questions.cancellation.a',
      isOpen: false
    },
    {
      id: 'emergency',
      category: 'general',
      questionKey: 'faq.questions.emergency.q',
      answerKey: 'faq.questions.emergency.a',
      isOpen: false
    },
    // For Pet Sitters
    {
      id: 'becomeSitter',
      category: 'forSitters',
      questionKey: 'faq.questions.becomeSitter.q',
      answerKey: 'faq.questions.becomeSitter.a',
      isOpen: false
    },
    {
      id: 'earnings',
      category: 'forSitters',
      questionKey: 'faq.questions.earnings.q',
      answerKey: 'faq.questions.earnings.a',
      isOpen: false
    },
    {
      id: 'payment',
      category: 'forSitters',
      questionKey: 'faq.questions.payment.q',
      answerKey: 'faq.questions.payment.a',
      isOpen: false
    },
    {
      id: 'insurance',
      category: 'forSitters',
      questionKey: 'faq.questions.insurance.q',
      answerKey: 'faq.questions.insurance.a',
      isOpen: false
    },
    {
      id: 'multiPets',
      category: 'forSitters',
      questionKey: 'faq.questions.multiPets.q',
      answerKey: 'faq.questions.multiPets.a',
      isOpen: false
    },
    // General
    {
      id: 'reviews',
      category: 'general',
      questionKey: 'faq.questions.reviews.q',
      answerKey: 'faq.questions.reviews.a',
      isOpen: false
    }
  ]);

  // Filtered FAQ items based on search query
  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.faqItems();
    }
    
    // Note: In a real app, you'd translate the questions/answers first
    // For now, we filter by ID which contains keywords
    return this.faqItems().filter(item => 
      item.id.toLowerCase().includes(query) ||
      item.questionKey.toLowerCase().includes(query)
    );
  });

  // Get items by category
  getItemsByCategory(category: 'forOwners' | 'forSitters' | 'general'): FaqItem[] {
    return this.filteredItems().filter(item => item.category === category);
  }

  // Toggle accordion item
  toggleItem(itemId: string): void {
    const items = this.faqItems();
    const updatedItems = items.map(item => ({
      ...item,
      isOpen: item.id === itemId ? !item.isOpen : item.isOpen
    }));
    this.faqItems.set(updatedItems);
  }

  // Check if item is open
  isItemOpen(itemId: string): boolean {
    const item = this.faqItems().find(i => i.id === itemId);
    return item?.isOpen || false;
  }

  // Update search query
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  // Expand all items in a category
  expandCategory(category: 'forOwners' | 'forSitters' | 'general'): void {
    const items = this.faqItems();
    const updatedItems = items.map(item => ({
      ...item,
      isOpen: item.category === category ? true : item.isOpen
    }));
    this.faqItems.set(updatedItems);
  }

  // Collapse all items
  collapseAll(): void {
    const items = this.faqItems();
    const updatedItems = items.map(item => ({
      ...item,
      isOpen: false
    }));
    this.faqItems.set(updatedItems);
  }
}
