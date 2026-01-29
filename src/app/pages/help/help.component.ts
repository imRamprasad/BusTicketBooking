import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent implements OnInit {
  faqs: any[] = [];
  activeAccordion: number | null = null;
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  };
  formSubmitted = false;
  showThankYou = false;

  categories = [
    { id: 'general', name: 'General Enquiry', icon: '❓' },
    { id: 'booking', name: 'Booking Related', icon: '🎟️' },
    { id: 'payment', name: 'Payment Issues', icon: '💳' },
    { id: 'cancellation', name: 'Cancellation/Refund', icon: '🔄' },
    { id: 'technical', name: 'Technical Support', icon: '🛠️' },
    { id: 'complaint', name: 'Complaint', icon: '⚠️' }
  ];

  contactInfo = [
    {
      type: 'Email',
      value: 'support@busbooks.com',
      icon: 'bi bi-envelope',
      color: '#e74c3c'
    },
    {
      type: 'Phone',
      value: '+91 1800-123-4567',
      icon: 'bi bi-telephone',
      color: '#3498db'
    },
    {
      type: 'Live Chat',
      value: 'Available 24/7',
      icon: 'bi bi-chat-dots',
      color: '#2ecc71'
    },
    {
      type: 'Address',
      value: '123 Tech Park, Mumbai, India',
      icon: 'bi bi-geo-alt',
      color: '#f39c12'
    }
  ];

  ngOnInit() {
    this.loadFAQs();
  }

  loadFAQs() {
    this.faqs = [
      {
        id: 1,
        question: 'How do I book a bus ticket?',
        answer: 'To book a bus ticket, follow these simple steps: 1) Go to the Search page, 2) Select your departure and arrival locations, 3) Choose your preferred date, 4) Browse available buses, 5) Select your preferred bus and seats, 6) Enter passenger details, 7) Complete payment, 8) Receive your booking confirmation via email.',
        category: 'booking'
      },
      {
        id: 2,
        question: 'Can I cancel my booking?',
        answer: 'Yes, you can cancel your booking up to 24 hours before the departure time. To cancel, go to "My Tickets", select the booking you want to cancel, and click the "Cancel" button. Please note that cancellation charges may apply depending on the bus operator\'s policy.',
        category: 'cancellation'
      },
      {
        id: 3,
        question: 'What is your refund policy?',
        answer: 'Refunds are processed within 24-48 hours of cancellation. The refund amount depends on the cancellation charges deducted by the bus operator. You can track your refund status in the "My Tickets" section. Refunds are credited to your original payment method.',
        category: 'cancellation'
      },
      {
        id: 4,
        question: 'How can I apply a coupon code?',
        answer: 'You can apply a coupon code during the booking process. In the payment section, you\'ll find a "Enter Coupon Code" field. Simply enter your valid coupon code and click "Apply". The discount will be automatically deducted from your total amount.',
        category: 'general'
      },
      {
        id: 5,
        question: 'What payment methods do you accept?',
        answer: 'We accept all major payment methods including: Credit Cards (Visa, Mastercard, American Express), Debit Cards, Net Banking, Digital Wallets (PayPal, Google Pay, Apple Pay), and UPI (Unified Payments Interface).',
        category: 'payment'
      },
      {
        id: 6,
        question: 'Is my payment secure?',
        answer: 'Yes, all payments are secured with 256-bit SSL encryption and comply with international security standards (PCI DSS). Your sensitive payment information is never stored on our servers.',
        category: 'payment'
      },
      {
        id: 7,
        question: 'How will I receive my ticket?',
        answer: 'Your ticket will be sent to your registered email address immediately after booking confirmation. You can also view and download your ticket from the "My Tickets" section. Make sure to carry either the printed ticket or show the soft copy on your mobile device during boarding.',
        category: 'booking'
      },
      {
        id: 8,
        question: 'What if I miss my bus?',
        answer: 'Unfortunately, no refund will be provided if you miss your bus departure. However, you can contact our customer support team to explore if an alternative date can be arranged, subject to availability and applicable charges.',
        category: 'general'
      },
      {
        id: 9,
        question: 'Can I change my travel date?',
        answer: 'Yes, you can reschedule your booking up to 24 hours before departure. Go to "My Tickets", select your booking, and click "Reschedule". You can choose a new date from available options. A rescheduling fee may apply as per the bus operator\'s policy.',
        category: 'booking'
      },
      {
        id: 10,
        question: 'How do I contact customer support?',
        answer: 'You can reach our customer support team through multiple channels: Email: support@busbooks.com, Phone: +91 1800-123-4567, Live Chat: Available 24/7 on our website, or use the contact form in the Help section.',
        category: 'general'
      }
    ];
  }

  toggleAccordion(index: number) {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  filterFAQs(category: string): any[] {
    if (category === 'all') {
      return this.faqs;
    }
    return this.faqs.filter(faq => faq.category === category);
  }

  submitContactForm() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.subject || !this.contactForm.message) {
      alert('Please fill in all fields');
      return;
    }

    // Simulate form submission
    this.formSubmitted = true;
    this.showThankYou = true;

    // Reset form
    setTimeout(() => {
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      };
      this.formSubmitted = false;
      this.showThankYou = false;
    }, 3000);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }
}
