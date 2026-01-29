import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../service/master.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit {
  offers: any[] = [];
  allOffers: any[] = [];
  couponCode: string = '';
  appliedCoupon: any = null;
  selectedCategory: string = 'all';
  copiedCode: string = '';

  constructor(private masterSrv: MasterService) {}

  ngOnInit() {
    this.loadOffers();
  }

  loadOffers() {
    this.masterSrv.getAllOffers().subscribe((res: any) => {
      this.allOffers = res;
      this.filterOffers();
    }, error => {
      console.error('Error loading offers:', error);
      // Mock data for testing
      this.allOffers = this.getMockOffers();
      this.filterOffers();
    });
  }

  filterOffers() {
    if (this.selectedCategory === 'all') {
      this.offers = this.allOffers;
    } else {
      this.offers = this.allOffers.filter(o => o.category === this.selectedCategory);
    }
  }

  onCategoryChange() {
    this.filterOffers();
  }

  applyCoupon() {
    if (!this.couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    const offer = this.allOffers.find(o =>
      o.couponCode.toLowerCase() === this.couponCode.toLowerCase()
    );

    if (offer) {
      if (offer.isExpired) {
        alert('This coupon has expired');
      } else {
        this.appliedCoupon = offer;
        alert(`Coupon applied! You get ${offer.discount}% off`);
        localStorage.setItem('appliedCoupon', JSON.stringify(offer));
      }
    } else {
      alert('Invalid coupon code');
    }
  }

  copyCouponCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedCode = code;
      setTimeout(() => {
        this.copiedCode = '';
      }, 2000);
    });
  }

  getMockOffers(): any[] {
    return [
      {
        offerId: 1,
        title: 'First Booking Discount',
        description: 'Get 20% off on your first booking',
        discount: 20,
        couponCode: 'FIRST20',
        category: 'first-time',
        minAmount: 500,
        maxDiscount: 500,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isExpired: false,
        usageLimit: 100,
        usageCount: 45,
        image: '🎉'
      },
      {
        offerId: 2,
        title: 'Summer Special',
        description: 'Save up to 35% on all bus tickets',
        discount: 35,
        couponCode: 'SUMMER35',
        category: 'seasonal',
        minAmount: 800,
        maxDiscount: 1500,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isExpired: false,
        usageLimit: 500,
        usageCount: 320,
        image: '☀️'
      },
      {
        offerId: 3,
        title: 'Group Booking Offer',
        description: 'Book for 4+ people and get 30% off',
        discount: 30,
        couponCode: 'GROUP30',
        category: 'group',
        minAmount: 2000,
        maxDiscount: 2000,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isExpired: false,
        usageLimit: 200,
        usageCount: 85,
        image: '👥'
      },
      {
        offerId: 4,
        title: 'Weekend Getaway',
        description: '25% discount on weekend travel',
        discount: 25,
        couponCode: 'WEEKEND25',
        category: 'seasonal',
        minAmount: 600,
        maxDiscount: 800,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isExpired: false,
        usageLimit: 300,
        usageCount: 150,
        image: '🎊'
      },
      {
        offerId: 5,
        title: 'Student Discount',
        description: 'Flat 15% off with valid student ID',
        discount: 15,
        couponCode: 'STUDENT15',
        category: 'student',
        minAmount: 400,
        maxDiscount: 600,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        isExpired: false,
        usageLimit: 1000,
        usageCount: 500,
        image: '📚'
      },
      {
        offerId: 6,
        title: 'Senior Citizen Special',
        description: '20% discount for senior citizens (60+)',
        discount: 20,
        couponCode: 'SENIOR20',
        category: 'senior',
        minAmount: 500,
        maxDiscount: 800,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isExpired: false,
        usageLimit: 500,
        usageCount: 200,
        image: '👴'
      }
    ];
  }

  getDaysRemaining(validTo: Date): number {
    const today = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((new Date(validTo).getTime() - today.getTime()) / msPerDay);
  }

  getProgressPercentage(usageCount: number, usageLimit: number): number {
    return (usageCount / usageLimit) * 100;
  }
}
