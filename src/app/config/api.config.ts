export const API_CONFIG = {
  // Using proxy for development, full URL for production
  baseUrl: '/api/BusBooking/',
  endpoints: {
    locations: 'GetBusLocations',
    searchBus: 'searchBus',
    scheduleById: 'GetBusScheduleById',
    bookedSeats: 'getBookedSeats',
    addUser: 'AddNewUser',
    bookBus: 'PostBusBooking',
    addSchedule: 'PostBusSchedule',
    getSchedules: 'GetBusSchedules',
    updateSchedule: 'PutBusSchedule',
    deleteSchedule: 'DeleteBusSchedule',
    getVendors: 'GetBusVendors',
    addVendor: 'PostBusVendor',
    getAllBuses: 'GetBusSchedules',
    getAllVendors: 'GetBusVendors',
    getAllOffers: 'GetBusSchedules',
    getUserBookings: 'GetBusSchedules',
    cancelBooking: 'PostBusBooking'
  }
};
