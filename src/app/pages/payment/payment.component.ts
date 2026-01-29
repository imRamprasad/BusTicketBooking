import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../service/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  @Input() bookingAmount: number = 0;
  @Input() bookingId: number = 0;
  @Input() customerEmail: string = '';
  @Input() customerPhone: string = '';
  @Input() customerName: string = '';
  @Input() busRate: number = 500; // Default bus rate per seat
  @Input() numberOfSeats: number = 0;

  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentFailed = new EventEmitter<any>();

  isProcessing = false;
  paymentError = '';
  paymentSuccess$ = false;
  showQRCode = false;
  qrCodeUrl = '';
  orderId: string = '';
  paymentTimer: any;
  timeLeft = 300; // 5 minutes in seconds

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    if (this.bookingAmount && this.bookingId) {
      this.generatePaymentOrder();
    }
  }

  /**
   * Generate mock payment order
   */
  generatePaymentOrder(): void {
    this.isProcessing = true;
    this.paymentError = '';

    // Generate mock order ID
    this.orderId = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Generate QR code URL for UPI payment
    this.generateQRCode();

    this.isProcessing = false;
    this.showQRCode = true;
    this.startPaymentTimer();
  }

  /**
   * Generate QR code for payment
   */
  generateQRCode(): void {
    // Create UPI payment string with specific UPI ID and name "ram bus"
    const upiString = `upi://pay?pa=8019388281@ybl&pn=ram bus&am=${this.bookingAmount}&cu=INR&tn=Booking_${this.bookingId}`;
    // For demo purposes, we'll use a placeholder QR code service
    // In production, you'd use a real QR code generation service
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  }

  /**
   * Start payment timer
   */
  startPaymentTimer(): void {
    this.timeLeft = 300; // 5 minutes
    this.paymentTimer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.paymentTimeout();
      }
    }, 1000);
  }

  /**
   * Handle payment timeout
   */
  paymentTimeout(): void {
    if (this.paymentTimer) {
      clearInterval(this.paymentTimer);
    }
    this.paymentError = 'Payment session expired. Please try again.';
    this.showQRCode = false;
    this.paymentFailed.emit({ message: 'Payment timeout' });
  }

  /**
   * Simulate payment completion (for demo)
   */
  completePayment(): void {
    if (this.paymentTimer) {
      clearInterval(this.paymentTimer);
    }

    this.isProcessing = true;
    this.paymentError = '';

    // Simulate payment processing
    setTimeout(() => {
      this.isProcessing = false;
      this.paymentSuccess$ = true;
      this.showQRCode = false;

      const paymentResponse = {
        paymentId: 'PAY_' + Date.now(),
        orderId: this.orderId,
        amount: this.bookingAmount,
        status: 'success',
        bookingId: this.bookingId
      };

      this.paymentSuccess.emit(paymentResponse);
    }, 2000);
  }

  /**
   * Cancel payment
   */
  cancelPayment(): void {
    if (this.paymentTimer) {
      clearInterval(this.paymentTimer);
    }
    this.showQRCode = false;
    this.paymentError = 'Payment cancelled by user.';
    this.paymentFailed.emit({ message: 'Payment cancelled' });
  }

  /**
   * Retry payment
   */
  retryPayment(): void {
    this.paymentError = '';
    this.paymentSuccess$ = false;
    this.showQRCode = false;
    if (this.paymentTimer) {
      clearInterval(this.paymentTimer);
    }
    this.generatePaymentOrder();
  }

  /**
   * Get formatted amount
   */
  getFormattedAmount(): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(this.bookingAmount);
  }

  /**
   * Format time remaining
   */
  getTimeRemaining(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    if (this.paymentTimer) {
      clearInterval(this.paymentTimer);
    }
  }
}
