import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe, FormsModule,DatePipe,RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{

  locations$: Observable<any[]>  = new Observable<any[]>;
  masterSrv = inject(MasterService);
  busList: any[]=[];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  serachObj: any = {
    fromLocation:'',
    toLocation:'',
    travelDate:''
  }

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    this.locations$  = this.masterSrv.getLocations();
  }

  onSearch() {
    const {fromLocation,toLocation,travelDate} = this.serachObj;

    // Validate inputs
    if(!fromLocation || !toLocation || !travelDate) {
      this.errorMessage = "Please select all fields: From Location, To Location, and Travel Date";
      this.busList = [];
      return;
    }

    // Validate locations are different
    if(fromLocation == toLocation) {
      this.errorMessage = "From Location and To Location cannot be the same";
      this.busList = [];
      return;
    }

    // Validate date is not in past
    const dateObj = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateObj < today) {
      this.errorMessage = "Please select a future date for travel";
      this.busList = [];
      return;
    }

    // Validate date is valid
    if (isNaN(dateObj.getTime())) {
      this.errorMessage = "Invalid travel date selected. Please select a valid date.";
      this.busList = [];
      return;
    }

    // Format as YYYY-MM-DD
    const formattedDate = dateObj.toISOString().split('T')[0];

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Perfect API call with proper error handling
    this.masterSrv.searchBusesComplete(fromLocation, toLocation, formattedDate).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.busList = res && res.length > 0 ? res : [];

        if(this.busList.length === 0) {
          this.errorMessage = "No buses found for the selected route and date. Try a different date or route.";
        } else {
          this.successMessage = `Found ${this.busList.length} bus(es) for your journey!`;
          setTimeout(() => this.successMessage = '', 4000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Search error:', err);
        this.errorMessage = "Error searching for buses. Please try again or contact support.";
        this.busList = [];
      }
    });
  }

  clearSearch() {
    this.serachObj = {
      fromLocation:'',
      toLocation:'',
      travelDate:''
    };
    this.busList = [];
    this.errorMessage = '';
    this.successMessage = '';
  }
}
