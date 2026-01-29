import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from '../../service/master.service';
import { PaymentService } from '../../service/payment.service';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, PaymentComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit, OnDestroy {

  scheduleId: number = 0;
  scehduielData: any;

  seatArray: number [] = [];
  bookedSeatsArray: number []= [];

  userSelectedSeatArray: any []= [];
  passengers: any[] = [];

  // Payment related properties
  showPaymentModal: boolean = false;
  bookingAmount: number = 0;
  bookingId: number = 0;
  paymentProcessing: boolean = false;
  paymentSuccess: boolean = false;

  private pollSubscription: Subscription | null = null;
  private pollInterval = 5000; // Poll every 5 seconds

  constructor(private activatedRouet: ActivatedRoute, private masterSrv: MasterService, private paymentSrv: PaymentService){
    this.activatedRouet.params.subscribe((res:any)=>{
      this.scheduleId = res.id;
      this.getScehduleDetaislById();
      this.getBookedSeats();
    })
  }

  ngOnInit() {
    // Start polling for real-time seat availability updates
    this.startRealTimeUpdates();
  }

  ngOnDestroy() {
    // Stop polling when component is destroyed
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  startRealTimeUpdates() {
    this.pollSubscription = interval(this.pollInterval).subscribe(() => {
      this.getBookedSeats();
    });
  }

  getScehduleDetaislById() {
    this.masterSrv.getScehduelById(this.scheduleId).subscribe((res:any)=>{
      debugger;
      this.scehduielData =  res;
      for (let index = 1; index <= this.scehduielData.totalSeats; index++) {
        this.seatArray.push(index)
      }
    })
  }

  getBookedSeats() {
    this.masterSrv.getBookedSeats(this.scheduleId).subscribe((res:any)=>{
      debugger;
      this.bookedSeatsArray =  res;
    })
  }

  checkIfSeatBooked(seatNo: number) {
    return this.bookedSeatsArray.indexOf(seatNo);
  }

  selectSeat(seatNo: number) {
    debugger;
    const index = this.userSelectedSeatArray.findIndex(m => m.seatNo == seatNo);

    if (index != -1) {
      // Seat is already selected, so remove it (deselect)
      this.userSelectedSeatArray.splice(index, 1);
      this.passengers.splice(index, 1);
    } else {
      // Seat is not selected, so add it
      const obj = {
        "passengerId": 0,
        "bookingId": 0,
        "passengerName": "",
        "name": "",
        "age": 0,
        "gender": "",
        "seatNo": 0
      }
      obj.seatNo = seatNo;
      this.userSelectedSeatArray.push(obj);
      this.passengers.push(obj);
    }
  }

  checkIsSeatSelected(seatNo: number) {
    return this.userSelectedSeatArray.findIndex(m=>m.seatNo == seatNo);
  }

  bookNow() {
    debugger;
    if(this.userSelectedSeatArray.length == 0) {
      alert('Please Select Seats n Add Passenger details')
    } else {
      // Calculate booking amount based on bus price
      const pricePerSeat = this.scehduielData?.price || 500;
      this.bookingAmount = this.userSelectedSeatArray.length * pricePerSeat;

      // Create temporary booking object (use a default customer ID since no login required)
      const bookingObj = {
        "bookingId": 0,
        "custId": 1, // Default customer ID
        "bookingDate": new Date(),
        "scheduleId": this.scheduleId,
        "BusBookingPassengers":  this.userSelectedSeatArray
      }

      // First create the booking to get booking ID
      this.masterSrv.onBooking(bookingObj).subscribe((Res:any)=>{
          this.bookingId = Res.bookingId || Res.id;
          this.showPaymentModal = true;
      },error=> {
        alert("Booking creation failed. Please try again.")
      })
    }
  }

  /**
   * Handle successful payment
   */
  onPaymentSuccess(paymentResponse: any): void {
    this.paymentSuccess = true;
    this.showPaymentModal = false;
    alert("Payment and booking confirmed successfully!");
    // Redirect or refresh booking list
    setTimeout(() => {
      window.location.href = '/tickets';
    }, 2000);
  }

  /**
   * Handle failed payment
   */
  onPaymentFailed(error: any): void {
    this.paymentProcessing = false;
    alert("Payment failed. Your booking has been saved and you can retry payment later.");
  }

  /**
   * Close payment modal
   */
  closePaymentModal(): void {
    this.showPaymentModal = false;
  }
}

