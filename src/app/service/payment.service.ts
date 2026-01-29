import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

declare var Razorpay: any; // Declare Razorpay type

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiConfig = API_CONFIG;
  private razorpayKey = 'YOUR_RAZORPAY_KEY_ID'; // Replace with your actual key

  constructor(private http: HttpClient) {
    this.loadRazorpayScript();
  }

  /**
   * Load Razorpay script dynamically
   */
  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('razorpay-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }

  /**
   * Create order on backend
   */
  createOrder(amount: number, bookingId: number): Observable<any> {
    const payload = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      payment_capture: 1
    };
    return this.http.post(`${this.apiConfig.baseUrl}CreatePaymentOrder`, payload);
  }

  /**
   * Initialize Razorpay payment
   */
  initiatePayment(
    orderId: string,
    amount: number,
    customerEmail: string,
    customerPhone: string,
    customerName: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadRazorpayScript().then(() => {
        const options = {
          key: this.razorpayKey,
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          name: 'Bus Booking System',
          description: 'Booking Confirmation',
          image: '/assets/logo.png', // Your company logo URL
          order_id: orderId,
          handler: (response: any) => {
            resolve(response);
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone
          },
          notes: {
            booking_id: orderId,
            address: 'Bus Booking System'
          },
          theme: {
            color: '#dc3545' // Red color matching your bus booking theme
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled'));
            }
          }
        };

        const razorpay = new Razorpay(options);
        razorpay.open();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Verify payment signature
   */
  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiConfig.baseUrl}VerifyPayment`, paymentData);
  }

  /**
   * Get payment status
   */
  getPaymentStatus(orderId: string): Observable<any> {
    return this.http.get(`${this.apiConfig.baseUrl}GetPaymentStatus/${orderId}`);
  }

  /**
   * Cancel payment/refund
   */
  cancelPayment(paymentId: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiConfig.baseUrl}RefundPayment`, {
      payment_id: paymentId,
      amount: amount * 100
    });
  }

  /**
   * Update Razorpay Key
   */
  setRazorpayKey(key: string): void {
    this.razorpayKey = key;
  }
}
