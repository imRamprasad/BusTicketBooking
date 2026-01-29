import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../service/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buses.component.html',
  styleUrl: './buses.component.css'
})
export class BusesComponent implements OnInit {
  buses: any[] = [];
  filteredBuses: any[] = [];
  locations: any[] = [];

  // Location search
  searchObj = {
    fromLocation: '',
    toLocation: '',
    travelDate: ''
  };

  // Filter properties
  filterVendor: string = '';
  filterBusType: string = '';
  filterPriceRange: string = 'all';
  filterRating: string = '';
  searchText: string = '';

  // Sorting
  sortBy: string = 'price-asc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  vendors: any[] = [];
  busTypes: string[] = ['AC Sleeper', 'AC Semi-Sleeper', 'AC Seater', 'Non-AC'];

  constructor(private masterSrv: MasterService, private router: Router) {
    // Start with empty - will load from real API
    this.buses = [];
    this.filteredBuses = [];
  }

  ngOnInit() {
    this.loadBuses();
    this.loadLocations();
    this.loadVendors();
  }

  loadBuses() {
    this.masterSrv.getAllBuses().subscribe((res: any) => {
      console.log('API Response - getAllBuses:', res.length, 'buses from API');
      // Use ONLY API data - no mock fallback
      this.buses = (res && Array.isArray(res) && res.length > 0) ? res : [];
      console.log('Buses loaded from API:', this.buses.length, 'buses');
      this.applyFiltersAndSort();
    }, error => {
      console.error('Error loading buses:', error);
      // Show empty state - user can refresh to retry
      this.buses = [];
      this.applyFiltersAndSort();
    });
  }

  loadLocations() {
    this.masterSrv.getLocations().subscribe((res: any) => {
      console.log('Locations loaded from API:', res.length, 'locations');
      this.locations = res && res.length > 0 ? res : [];
    }, error => {
      console.error('Error loading locations:', error);
      this.locations = [];
    });
  }

  loadVendors() {
    this.masterSrv.getAllVendors().subscribe((res: any) => {
      console.log('Vendors loaded from API:', res.length, 'vendors');
      this.vendors = (res && Array.isArray(res) && res.length > 0) ? res : [];
    }, error => {
      console.error('Error loading vendors:', error);
      this.vendors = [];
    });
  }

  applyFiltersAndSort() {
    let filtered = [...this.buses];

    // IMPORTANT: Show all buses by default. Location filters are optional and only apply when BOTH are selected
    // This prevents accidentally filtering to zero results when user only selected one location
    const hasFromLocation = this.searchObj.fromLocation && this.searchObj.fromLocation !== '';
    const hasToLocation = this.searchObj.toLocation && this.searchObj.toLocation !== '';

    // Only apply location filters if BOTH locations are selected (for a meaningful route filter)
    if (hasFromLocation && hasToLocation) {
      const fromId = Number(this.searchObj.fromLocation);
      const toId = Number(this.searchObj.toLocation);

      filtered = filtered.filter(bus => {
        const busFromId = Number(bus.fromLocationId);
        const busToId = Number(bus.toLocationId);
        return busFromId === fromId && busToId === toId;
      });
      console.log('Route filter applied: From', fromId, 'To', toId, '- Found:', filtered.length, 'buses');
    } else if (hasFromLocation) {
      // If only fromLocation is selected, filter by it
      const fromId = Number(this.searchObj.fromLocation);
      filtered = filtered.filter(bus => {
        const busFromId = Number(bus.fromLocationId);
        return busFromId === fromId;
      });
      console.log('FromLocation filter only: Looking for fromLocationId:', fromId, '- Found:', filtered.length, 'buses');
    } else if (hasToLocation) {
      // If only toLocation is selected, filter by it
      const toId = Number(this.searchObj.toLocation);
      filtered = filtered.filter(bus => {
        const busToId = Number(bus.toLocationId);
        return busToId === toId;
      });
      console.log('ToLocation filter only: Looking for toLocationId:', toId, '- Found:', filtered.length, 'buses');
    }

    // Optional: Apply travel date filter only if date is selected
    // NOTE: API data may have limited dates, so we show all buses if no matching date
    if (this.searchObj.travelDate) {
      const busesBeforeDate = filtered.length;

      filtered = filtered.filter(bus => {
        try {
          const busDate = new Date(bus.scheduleDate).toISOString().split('T')[0];
          const selectedDate = new Date(this.searchObj.travelDate).toISOString().split('T')[0];
          return busDate === selectedDate;
        } catch (e) {
          return false;
        }
      });

      // If date filter results in 0 buses, show all buses for that route
      // (API may not have buses for all dates)
      if (filtered.length === 0) {
        console.log(`No buses for selected date, showing all ${busesBeforeDate} buses for the route`);
        // Reset to show buses from before date filter was applied
        if (hasFromLocation && hasToLocation) {
          const fromId = Number(this.searchObj.fromLocation);
          const toId = Number(this.searchObj.toLocation);
          filtered = this.buses.filter(bus =>
            Number(bus.fromLocationId) === fromId && Number(bus.toLocationId) === toId
          );
        } else if (hasFromLocation) {
          const fromId = Number(this.searchObj.fromLocation);
          filtered = this.buses.filter(bus => Number(bus.fromLocationId) === fromId);
        } else if (hasToLocation) {
          const toId = Number(this.searchObj.toLocation);
          filtered = this.buses.filter(bus => Number(bus.toLocationId) === toId);
        } else {
          filtered = [...this.buses];
        }
      } else {
        console.log('After travelDate filter:', filtered.length, 'buses');
      }
    }

    // Apply text search filters
    if (this.searchText) {
      filtered = filtered.filter(bus =>
        bus.vendorName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        bus.busType?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.filterVendor) {
      filtered = filtered.filter(bus => bus.vendorId == this.filterVendor);
    }

    if (this.filterBusType) {
      filtered = filtered.filter(bus => bus.busType === this.filterBusType);
    }

    if (this.filterPriceRange !== 'all') {
      const [min, max] = this.filterPriceRange.split('-').map(Number);
      filtered = filtered.filter(bus => bus.price >= min && bus.price <= max);
    }

    if (this.filterRating) {
      filtered = filtered.filter(bus => bus.rating >= Number(this.filterRating));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'departure':
          return this.timeToMinutes(a.departureTime) - this.timeToMinutes(b.departureTime);
        default:
          return 0;
      }
    });

    // Calculate pagination
    this.filteredBuses = filtered;
    this.totalPages = Math.ceil(this.filteredBuses.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredBuses.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  private timeToMinutes(time: string): number {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getPaginatedBuses() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBuses.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onSearchClick() {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onSortChange() {
    this.applyFiltersAndSort();
  }

  resetFilters() {
    this.filterVendor = '';
    this.filterBusType = '';
    this.filterPriceRange = 'all';
    this.filterRating = '';
    this.searchText = '';
    this.sortBy = 'price-asc';
    this.searchObj = {
      fromLocation: '',
      toLocation: '',
      travelDate: ''
    };
    this.applyFiltersAndSort();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  bookBus(scheduleId: number) {
    this.router.navigate(['/booking', scheduleId]);
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating || 0)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating || 0)).fill(0);
  }

  getMockBuses(): any[] {
    // Comprehensive mock data covering multiple locations and routes for demo
    const vendors = ['Red Express', 'Sky Travels', 'Gold Travels', 'Silver Lines', 'Express Plus', 'Royal Travels'];
    const busTypes = ['AC Sleeper', 'AC Semi-Sleeper', 'AC Seater', 'Non-AC'];
    const locations = [
      { id: 251, name: 'Delhi' },
      { id: 252, name: 'Pune' },
      { id: 253, name: 'Nagpur' },
      { id: 249, name: 'Leo' },
      { id: 264, name: 'Another City' },
      { id: 270, name: 'Destination' }
    ];

    let scheduleId = 1;
    const buses: any[] = [];

    // Generate buses for all location combinations
    for (let fromLoc of locations) {
      for (let toLoc of locations) {
        if (fromLoc.id !== toLoc.id) {
          // Create 3-4 buses for each route with different timings
          for (let i = 0; i < 3; i++) {
            const vendor = vendors[Math.floor(Math.random() * vendors.length)];
            const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
            const departureHour = (6 + i * 8) % 24;
            const price = Math.floor(Math.random() * 800) + 300; // 300-1100
            const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0

            buses.push({
              scheduleId: scheduleId++,
              vendorId: Math.floor(Math.random() * 10) + 1,
              fromLocationId: fromLoc.id,
              fromLocationName: fromLoc.name,
              toLocationId: toLoc.id,
              toLocationName: toLoc.name,
              departureTime: `${String(departureHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
              arrivalTime: `${String((departureHour + 6 + Math.floor(Math.random() * 4)) % 24).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
              reachingTime: `${String((departureHour + 6 + Math.floor(Math.random() * 4)) % 24).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
              totalSeats: 45 + Math.floor(Math.random() * 15),
              availableSeats: Math.floor(Math.random() * 20),
              price: price,
              scheduleDate: new Date().toISOString(),
              busType: busType,
              vendorName: vendor,
              busName: `${vendor} ${busType}`,
              busVehicleNo: `TN${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
              rating: Number(rating)
            });
          }
        }
      }
    }

    return buses;
  }

  getMockLocations(): any[] {
    return [
      { locationId: 251, locationName: 'Delhi' },
      { locationId: 252, locationName: 'Pune' },
      { locationId: 253, locationName: 'Nagpur' },
      { locationId: 249, locationName: 'Leo' },
      { locationId: 264, locationName: 'Another City' },
      { locationId: 270, locationName: 'Destination' }
    ];
  }

  getMockVendors(): any[] {
    return [
      { vendorId: 1, vendorName: 'Red Express' },
      { vendorId: 2, vendorName: 'Sky Travels' },
      { vendorId: 3, vendorName: 'Gold Travels' },
      { vendorId: 4, vendorName: 'Silver Lines' },
      { vendorId: 5, vendorName: 'Express Plus' },
      { vendorId: 6, vendorName: 'Royal Travels' }
    ];
  }
}
