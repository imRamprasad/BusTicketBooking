import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { BookingComponent } from './pages/booking/booking.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BusesComponent } from './pages/buses/buses.component';
import { OffersComponent } from './pages/offers/offers.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { HelpComponent } from './pages/help/help.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'search',
        pathMatch:'full'
    },
    {
        path:'search',
        component:SearchComponent
    },
    {
        path:'buses',
        component:BusesComponent
    },
    {
        path:'booking/:id',
        component:BookingComponent
    },
    {
        path:'admin',
        component:AdminComponent
    },
    {
        path:'offers',
        component:OffersComponent
    },
    {
        path:'tickets',
        component:TicketsComponent
    },
    {
        path:'help',
        component:HelpComponent
    }
];

