import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../service/master.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  userEmail: string = '';
  loggedUser: any;
  filterStatus: string = 'all';
  searchText: string = '';
  selectedBooking: any = null;
  showDetails = false;

  statusColors: any = {
    'confirmed': '#28a745',
    'pending': '#ffc107',
    'cancelled': '#dc3545',
    'completed': '#17a2b8'
  };

  constructor(private masterSrv: MasterService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    // Always use mock data since login is removed
    this.bookings = this.getMockBookings();
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.bookings];

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === this.filterStatus);
    }

    if (this.searchText) {
      filtered = filtered.filter(b =>
        b.vendorName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.from?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.to?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.bookingId?.toString().includes(this.searchText)
      );
    }

    this.filteredBookings = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  viewDetails(booking: any) {
    this.selectedBooking = booking;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    setTimeout(() => {
      this.selectedBooking = null;
    }, 300);
  }

  cancelBooking(bookingId: number) {
    if (confirm('Are you sure you want to cancel this booking? A refund will be processed.')) {
      this.masterSrv.cancelBooking(bookingId).subscribe((res: any) => {
        alert('Booking cancelled successfully. Refund will be processed within 24-48 hours.');
        this.loadBookings();
      }, error => {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
      });
    }
  }

  downloadTicket(booking: any) {
    const ticketContent = `
BOOKING CONFIRMATION - ${booking.bookingId}

Customer: ${booking.passengerName}
Email: ${this.userEmail}
Phone: ${booking.phoneNumber || 'N/A'}

Journey Details:
From: ${booking.from} → To: ${booking.to}
Date: ${new Date(booking.journeyDate).toLocaleDateString()}
Time: ${booking.departureTime}

Bus Details:
Vendor: ${booking.vendorName}
Bus Type: ${booking.busType}
Seats: ${booking.seats.join(', ')}

Pricing:
Ticket Price: ₹${booking.ticketPrice}
Discount: ₹${booking.discount || 0}
Total Amount: ₹${booking.totalAmount}

Status: ${booking.status}
Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}
`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ticketContent));
    element.setAttribute('download', `ticket-${booking.bookingId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  getMockBookings(): any[] {
    return [
      {
        bookingId: 'BK001',
        passengerName: 'John Doe',
        from: 'Nagpur',
        to: 'Pune',
        journeyDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        departureTime: '06:00 AM',
        vendorName: 'Red Express',
        busType: 'AC Sleeper',
        seats: ['17', '18', '19'],
        ticketPrice: 1800,
        discount: 300,
        totalAmount: 1500,
        status: 'confirmed',
        bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        phoneNumber: '9876543210'
      },
      {
        bookingId: 'BK002',
        passengerName: 'Jane Smith',
        from: 'Mumbai',
        to: 'Bangalore',
        journeyDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        departureTime: '10:30 PM',
        vendorName: 'Sky Travels',
        busType: 'AC Semi-Sleeper',
        seats: ['5', '6'],
        ticketPrice: 2400,
        discount: 0,
        totalAmount: 2400,
        status: 'pending',
        bookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        phoneNumber: '9876543210'
      },
      {
        bookingId: 'BK003',
        passengerName: 'John Doe',
        from: 'Delhi',
        to: 'Agra',
        journeyDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        departureTime: '08:00 AM',
        vendorName: 'Gold Travels',
        busType: 'AC Seater',
        seats: ['12', '13'],
        ticketPrice: 600,
        discount: 100,
        totalAmount: 500,
        status: 'completed',
        bookingDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        phoneNumber: '9876543210'
      },
      {
        bookingId: 'BK004',
        passengerName: 'John Doe',
        from: 'Bangalore',
        to: 'Hyderabad',
        journeyDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        departureTime: '09:00 PM',
        vendorName: 'Silver Lines',
        busType: 'AC Sleeper',
        seats: ['22'],
        ticketPrice: 900,
        discount: 0,
        totalAmount: 900,
        status: 'cancelled',
        bookingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        phoneNumber: '9876543210'
      }
    ];
  }

  getStatusBadgeColor(status: string): string {
    return this.statusColors[status] || '#6c757d';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'confirmed': 'bi bi-check-circle-fill',
      'pending': 'bi bi-hourglass-split',
      'cancelled': 'bi bi-x-circle-fill',
      'completed': 'bi bi-check2-all'
    };
    return icons[status] || 'bi bi-info-circle';
  }

  isJourneyUpcoming(journeyDate: Date): boolean {
    return new Date(journeyDate) > new Date();
  }
}
