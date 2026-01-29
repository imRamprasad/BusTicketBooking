import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private apiConfig = API_CONFIG;
  private locationCache: Map<string, number> = new Map(); // Cache for location name -> ID


  constructor(private http: HttpClient) { }

  getLocations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.locations)
  }

  serachBus(from: number, to: number, travelDate: string): Observable<any[]> {
    // Use GetBusSchedules endpoint and filter results client-side
    return this.http.get<any[]>(`${this.apiConfig.baseUrl}GetBusSchedules`).pipe(
      map((schedules: any[]) => {
        // Parse date safely - handle both YYYY-MM-DD and DD-MM-YYYY formats
        let searchDate = '';
        try {
          let dateObj;
          // Check if format is DD-MM-YYYY
          if (travelDate.includes('-') && travelDate.split('-')[0].length === 2) {
            const [day, month, year] = travelDate.split('-');
            dateObj = new Date(`${year}-${month}-${day}`);
          } else {
            // Assume YYYY-MM-DD format
            dateObj = new Date(travelDate);
          }

          // Validate date
          if (isNaN(dateObj.getTime())) {
            console.warn('Invalid date format:', travelDate);
            searchDate = '';
          } else {
            searchDate = dateObj.toISOString().split('T')[0];
          }
        } catch (e) {
          console.warn('Error parsing date:', travelDate, e);
          searchDate = '';
        }

        return schedules.filter(s =>
          s.fromLocationId == from &&
          s.toLocationId == to &&
          searchDate && (s.scheduleDate ? new Date(s.scheduleDate).toISOString().split('T')[0] : '') === searchDate
        );
      })
    );
  }

  // Search buses by route only (ignoring date)
  searchBusByRoute(from: number, to: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiConfig.baseUrl}GetBusSchedules`).pipe(
      map((schedules: any[]) => {
        return schedules.filter(s =>
          s.fromLocationId == from &&
          s.toLocationId == to
        );
      })
    );
  }

  // Perfect complete search API with intelligent filtering
  searchBusesComplete(fromLocationId: number, toLocationId: number, travelDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiConfig.baseUrl}GetBusSchedules`).pipe(
      map((schedules: any[]) => {
        if (!schedules || schedules.length === 0) {
          return [];
        }

        // Parse and normalize travel date
        let searchDate = '';
        try {
          const dateObj = new Date(travelDate);
          if (!isNaN(dateObj.getTime())) {
            searchDate = dateObj.toISOString().split('T')[0];
          }
        } catch (e) {
          console.warn('Error parsing date:', travelDate);
          return [];
        }

        // Filter by route and date with proper null/undefined checks
        let results = schedules.filter(bus => {
          // Check if bus has required fields
          if (!bus.fromLocationId || !bus.toLocationId || !bus.scheduleDate) {
            return false;
          }

          // Match location IDs
          const fromId = Number(bus.fromLocationId);
          const toId = Number(bus.toLocationId);
          const locationMatch = fromId === fromLocationId && toId === toLocationId;

          if (!locationMatch) {
            return false;
          }

          // Try to match date
          try {
            let busDateObj;
            const busDateStr = bus.scheduleDate;
            // Check if format is DD-MM-YYYY
            if (busDateStr.includes('-') && busDateStr.split('-')[0].length === 2) {
              const [day, month, year] = busDateStr.split('-');
              busDateObj = new Date(`${year}-${month}-${day}`);
            } else {
              busDateObj = new Date(busDateStr);
            }
            if (!isNaN(busDateObj.getTime())) {
              const busDate = busDateObj.toISOString().split('T')[0];
              return busDate === searchDate;
            } else {
              return false;
            }
          } catch (e) {
            return false;
          }
        });

        // If no exact date match found, return all buses for the route (sorted by date)
        if (results.length === 0) {
          results = schedules.filter(bus => {
            if (!bus.fromLocationId || !bus.toLocationId) {
              return false;
            }
            const fromId = Number(bus.fromLocationId);
            const toId = Number(bus.toLocationId);
            return fromId === fromLocationId && toId === toLocationId;
          });
        }

        // Transform results to match the format used in getAllBuses
        results = results.map(bus => ({
          scheduleId: bus.scheduleId,
          vendorId: bus.vendorId,
          vendorName: bus.vendorName || 'Unknown Vendor',
          busName: bus.busName || 'Bus',
          busVehicleNo: bus.busVehicleNo || '',
          fromLocationId: bus.fromLocationId,
          fromLocationName: bus.fromLocationName || '',
          toLocationId: bus.toLocationId,
          toLocationName: bus.toLocationName || '',
          scheduleDate: bus.scheduleDate,
          departureTime: bus.departureTime ? this.formatTime(bus.departureTime) : '00:00',
          arrivalTime: bus.arrivalTime ? this.formatTime(bus.arrivalTime) : '00:00',
          reachingTime: bus.arrivalTime ? this.formatTime(bus.arrivalTime) : '00:00',
          totalSeats: bus.totalSeats || 45,
          availableSeats: bus.availableSeats || 0,
          price: bus.price || 500,
          busType: this.detectBusType(bus.busName),
          rating: this.generateRating(bus.vendorId)
        }));

        // Sort by departure time
        results.sort((a, b) => {
          const timeA = a.departureTime || '';
          const timeB = b.departureTime || '';
          return timeA.localeCompare(timeB);
        });

        return results;
      })
    );
  }

  // Get all buses for route only
  getAllBusesForRoute(from: number, to: number, travelDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiConfig.baseUrl}GetBusSchedules`).pipe(
      map((schedules: any[]) => {
        if (!schedules || schedules.length === 0) {
          return [];
        }

        // Parse travel date
        let searchDate = '';
        try {
          const dateObj = new Date(travelDate);
          if (!isNaN(dateObj.getTime())) {
            searchDate = dateObj.toISOString().split('T')[0];
          }
        } catch (e) {
          console.warn('Error parsing date:', travelDate);
        }

        // First try exact date match
        let results = schedules.filter(s =>
          s.fromLocationId == from &&
          s.toLocationId == to &&
          searchDate && (s.scheduleDate ? new Date(s.scheduleDate).toISOString().split('T')[0] : '') === searchDate
        );

        // If no exact match, return all buses for the route
        if (results.length === 0) {
          results = schedules.filter(s =>
            s.fromLocationId == from &&
            s.toLocationId == to
          );
        }

        return results;
      })
    );
  }

  getScehduelById(id: number) {
    return this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.scheduleById + "?id="+id)

  }

  getBookedSeats(id: number) {
    return this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.bookedSeats + "?shceduleId="+id)

  }



  onBooking(obj: any) {
    return this.http.post<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.bookBus, obj)

  }

  // Schedule Management Methods
  getSchedules(): Observable<any[]> {
    return this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.getSchedules)
  }

  addSchedule(scheduleObj: any): Observable<any> {
    return this.http.post<any>(this.apiConfig.baseUrl + this.apiConfig.endpoints.addSchedule, scheduleObj)
  }

  updateSchedule(scheduleObj: any): Observable<any> {
    return this.http.put<any>(this.apiConfig.baseUrl + this.apiConfig.endpoints.updateSchedule, scheduleObj)
  }

  deleteSchedule(scheduleId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiConfig.baseUrl}${this.apiConfig.endpoints.deleteSchedule}?id=${scheduleId}`)
  }

  // Vendor Methods
  getVendors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.getVendors)
  }

  addVendor(vendorObj: any): Observable<any> {
    return this.http.post<any>(this.apiConfig.baseUrl + this.apiConfig.endpoints.addVendor, vendorObj)
  }

  // Buses Methods
  getAllBuses(): Observable<any[]> {
    // Fetch both locations and buses, then combine them
    return forkJoin([
      this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.locations),
      this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.getAllBuses)
    ]).pipe(
      map(([locations, schedules]: [any[], any[]]) => {
        // Build a map of location names to IDs for quick lookup
        const locationMap = new Map<string, number>();
        locations.forEach(loc => {
          locationMap.set(loc.locationName?.toLowerCase(), loc.locationId);
        });

        console.log('getAllBuses - Raw API response:', schedules.length, 'records');
        // Transform API response to ensure all required properties exist
        const transformed = schedules.map(bus => {
          // Extract location IDs from location names
          const fromLocName = (bus.fromLocationName || '').toLowerCase();
          const toLocName = (bus.toLocationName || '').toLowerCase();

          return {
            scheduleId: bus.scheduleId,
            vendorId: bus.vendorId,
            vendorName: bus.vendorName || 'Unknown Vendor',
            busName: bus.busName || 'Bus',
            busVehicleNo: bus.busVehicleNo || '',
            fromLocationId: locationMap.get(fromLocName) || 0,
            fromLocationName: bus.fromLocationName || '',
            toLocationId: locationMap.get(toLocName) || 0,
            toLocationName: bus.toLocationName || '',
            scheduleDate: bus.scheduleDate,
            departureTime: bus.departureTime ? this.formatTime(bus.departureTime) : '00:00',
            arrivalTime: bus.arrivalTime ? this.formatTime(bus.arrivalTime) : '00:00',
            reachingTime: bus.arrivalTime ? this.formatTime(bus.arrivalTime) : '00:00',
            totalSeats: bus.totalSeats || 45,
            availableSeats: bus.availableSeats || 0,
            price: bus.price || 500,
            busType: this.detectBusType(bus.busName),
            rating: this.generateRating(bus.vendorId)
          };
        });
        console.log('getAllBuses - Transformed response:', transformed.length, 'records with location IDs');
        return transformed;
      })
    );
  }

  private formatTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      return '00:00';
    }
  }

  private detectBusType(busName: string): string {
    if (!busName) return 'AC Seater';
    const name = busName.toLowerCase();
    if (name.includes('sleeper')) return 'AC Sleeper';
    if (name.includes('semi')) return 'AC Semi-Sleeper';
    if (name.includes('seater')) return 'AC Seater';
    if (name.includes('non')) return 'Non-AC';
    return 'AC Seater';
  }

  private generateRating(vendorId: number): number {
    // Generate consistent rating based on vendor ID
    const ratings = [3.5, 4.0, 4.2, 4.5, 3.8, 4.3, 4.1, 3.9, 4.4, 4.0];
    return ratings[vendorId % ratings.length];
  }

  getAllVendors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.getAllVendors)
  }

  // Offers Methods
  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.getAllOffers)
  }

  // Tickets/Bookings Methods
  getUserBookings(userId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiConfig.baseUrl + this.apiConfig.endpoints.getUserBookings + `?userId=${userId}`)
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.post<any>(this.apiConfig.baseUrl + this.apiConfig.endpoints.cancelBooking, { bookingId })
  }

  // Payment Methods
  createPaymentOrder(amount: number, bookingId: number): Observable<any> {
    const payload = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      payment_capture: 1
    };
    return this.http.post<any>(this.apiConfig.baseUrl + 'CreatePaymentOrder', payload);
  }

  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(this.apiConfig.baseUrl + 'VerifyPayment', paymentData);
  }

  getPaymentStatus(orderId: string): Observable<any> {
    return this.http.get<any>(this.apiConfig.baseUrl + `GetPaymentStatus/${orderId}`);
  }

  refundPayment(paymentId: string, amount: number): Observable<any> {
    const payload = {
      payment_id: paymentId,
      amount: amount * 100
    };
    return this.http.post<any>(this.apiConfig.baseUrl + 'RefundPayment', payload);
  }

}

