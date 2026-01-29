import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../service/master.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  locations: any[] = [];
  vendors: any[] = [];
  schedules: any[] = [];
  filteredSchedules: any[] = [];

  newSchedule: any = {
    scheduleId: 0,
    vendorId: 0,
    fromLocationId: 0,
    toLocationId: 0,
    departureTime: '06:00:00',
    reachingTime: '14:00:00',
    totalSeats: 45,
    price: 600,
    scheduleDate: '',
    busType: 'AC Sleeper'
  };

  editingSchedule: any = null;
  showForm = false;
  successMessage = '';
  errorMessage = '';
  activeTab = 'add';

  constructor(private masterSrv: MasterService) { }

  ngOnInit() {
    this.loadLocations();
    this.loadVendors();
    this.loadSchedules();
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  loadLocations() {
    this.masterSrv.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
      },
      error: (err) => {
        console.error('Error loading locations:', err);
      }
    });
  }

  loadVendors() {
    this.masterSrv.getVendors().subscribe({
      next: (data) => {
        this.vendors = data;
      },
      error: (err) => {
        console.error('Error loading vendors:', err);
      }
    });
  }

  loadSchedules() {
    this.masterSrv.getSchedules().subscribe({
      next: (data) => {
        this.schedules = data || [];
        this.filterSchedules();
        // If no schedules exist, create default Nagpur-Pune schedules
        if (this.schedules.length === 0) {
          this.createNagpurPuneSchedules();
        }
      },
      error: (err) => {
        console.error('Error loading schedules:', err);
      }
    });
  }

  filterSchedules() {
    if (this.activeTab === 'nagpur-pune') {
      this.filteredSchedules = this.schedules.filter(s =>
        (s.fromLocationId === 253 || s.fromLocationId === 330) &&
        (s.toLocationId === 252 || s.toLocationId === 270)
      );
    } else {
      this.filteredSchedules = this.schedules;
    }
  }

  openAddForm() {
    this.editingSchedule = null;
    this.newSchedule = {
      scheduleId: 0,
      vendorId: 0,
      fromLocationId: 0,
      toLocationId: 0,
      departureTime: '06:00:00',
      reachingTime: '14:00:00',
      totalSeats: 45,
      price: 600,
      scheduleDate: this.getTodayDate(),
      busType: 'AC Sleeper'
    };
    this.showForm = true;
  }

  openEditForm(schedule: any) {
    this.editingSchedule = schedule;
    this.newSchedule = { ...schedule };
    this.showForm = true;
  }

  saveSchedule() {
    if (!this.newSchedule.vendorId || !this.newSchedule.fromLocationId || !this.newSchedule.toLocationId) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (!this.newSchedule.scheduleDate) {
      this.errorMessage = 'Please select a schedule date';
      return;
    }

    // Validate conversions
    const vendorId = Number(this.newSchedule.vendorId);
    const fromLocationId = Number(this.newSchedule.fromLocationId);
    const toLocationId = Number(this.newSchedule.toLocationId);

    if (isNaN(vendorId) || isNaN(fromLocationId) || isNaN(toLocationId)) {
      this.errorMessage = 'Invalid vendor or location IDs';
      console.error('Invalid ID conversions:', { vendorId, fromLocationId, toLocationId });
      return;
    }

    // Prepare schedule data with numeric types
    const scheduleData: any = {
      vendorId: vendorId,
      fromLocationId: fromLocationId,
      toLocationId: toLocationId,
      departureTime: this.newSchedule.departureTime || '06:00:00',
      arrivalTime: this.newSchedule.reachingTime || this.newSchedule.arrivalTime || '14:00:00',
      totalSeats: Number(this.newSchedule.totalSeats) || 45,
      price: Number(this.newSchedule.price) || 600,
      scheduleDate: this.newSchedule.scheduleDate + 'T00:00:00',
      busType: this.newSchedule.busType || 'AC Sleeper'
    };

    console.log('Raw form values:', { vendorId: this.newSchedule.vendorId, fromLocationId: this.newSchedule.fromLocationId, toLocationId: this.newSchedule.toLocationId });
    console.log('Converted to:', { vendorId, fromLocationId, toLocationId });
    console.log('Sending schedule data:', scheduleData);

    if (this.editingSchedule) {
      // Update existing schedule
      scheduleData.scheduleId = this.editingSchedule.scheduleId;
      this.masterSrv.updateSchedule(scheduleData).subscribe({
        next: (response) => {
          this.successMessage = 'Schedule updated successfully!';
          this.showForm = false;
          this.loadSchedules();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error updating schedule:', err);
          this.errorMessage = 'Error updating schedule: ' + (err.error?.message || err.message || 'Server error');
        }
      });
    } else {
      // Add new schedule
      this.masterSrv.addSchedule(scheduleData).subscribe({
        next: (response) => {
          this.successMessage = 'Schedule added successfully!';
          this.showForm = false;
          this.loadSchedules();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error adding schedule:', err);
          this.errorMessage = 'Error adding schedule: ' + (err.error?.message || err.message || 'Server error');
        }
      });
    }
  }

  deleteSchedule(scheduleId: number) {
    if (confirm('Are you sure you want to delete this schedule?')) {
      this.masterSrv.deleteSchedule(scheduleId).subscribe({
        next: () => {
          this.successMessage = 'Schedule deleted successfully!';
          this.loadSchedules();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error deleting schedule: ' + err.message;
        }
      });
    }
  }

  getLocationName(locationId: number): string {
    const location = this.locations.find(l => l.locationId === locationId);
    return location ? location.locationName : 'Unknown';
  }

  getVendorName(vendorId: number): string {
    const vendor = this.vendors.find(v => v.vendorId === vendorId);
    return vendor ? vendor.vendorName : 'Unknown';
  }

  closeForm() {
    this.showForm = false;
    this.editingSchedule = null;
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.filterSchedules();
  }

  createNagpurPuneSchedules() {
    const schedulesToCreate = [
      { time: '06:00', reaching: '14:00', vendor: 782, seats: 45, price: 600 },
      { time: '10:00', reaching: '18:00', vendor: 85, seats: 50, price: 550 },
      { time: '14:00', reaching: '22:00', vendor: 86, seats: 48, price: 650 },
      { time: '20:00', reaching: '04:00', vendor: 137, seats: 40, price: 500 }
    ];

    let created = 0;
    let failed = 0;

    schedulesToCreate.forEach(schedule => {
      const today = new Date().toISOString().split('T')[0]; // Use today's date instead of hardcoded
      const scheduleData = {
        vendorId: schedule.vendor,
        fromLocationId: 253,
        toLocationId: 252,
        departureTime: schedule.time + ':00',
        arrivalTime: schedule.reaching + ':00',
        totalSeats: schedule.seats,
        price: schedule.price,
        scheduleDate: today + 'T00:00:00', // Use today's date
        busType: 'AC Sleeper'
      };

      console.log('Creating schedule:', scheduleData);

      this.masterSrv.addSchedule(scheduleData).subscribe({
        next: () => {
          created++;
          console.log(`Schedule created (${created}/${schedulesToCreate.length})`);
          if (created + failed === schedulesToCreate.length) {
            if (created > 0) {
              this.successMessage = `Successfully created ${created} schedule(s) for Nagpur to Pune!`;
            }
            if (failed > 0) {
              this.errorMessage = `${failed} schedule(s) failed to create`;
            }
            this.loadSchedules();
            setTimeout(() => {
              this.successMessage = '';
              this.errorMessage = '';
            }, 5000);
          }
        },
        error: (err) => {
          failed++;
          console.error('Error creating schedule:', err);
          if (created + failed === schedulesToCreate.length) {
            if (created > 0) {
              this.successMessage = `Created ${created} schedule(s), ${failed} failed`;
            } else {
              this.errorMessage = `Failed to create schedules`;
            }
            this.loadSchedules();
            setTimeout(() => {
              this.successMessage = '';
              this.errorMessage = '';
            }, 5000);
          }
        }
      });
    });
  }
}
