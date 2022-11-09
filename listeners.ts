import { listBookings, addBooking, fillHtmlElem, showConfirmButton, showCourts, showNewBookingForm, showPrices, updateSelectedEntities } from './functions.js'
import { state } from './main.js'

window.addEventListener('RefreshBookings', () => {
  const content = listBookings(state.bookings)
  fillHtmlElem('#bookings-list', content)
})

document.querySelector('#booking-costumers').addEventListener('change', (event: Event) => {
  const selectedValue = (event.target as HTMLSelectElement).value
  updateSelectedEntities(selectedValue, 'customer')
  showCourts(selectedValue, '#court-list', '#booking-courts')
})

document.querySelector('#booking-courts').addEventListener('change', (event: Event) => {
  const selectedValue = (event.target as HTMLSelectElement).value
  updateSelectedEntities(selectedValue, 'court')
  showPrices(selectedValue, '#price-list', '#booking-prices')
})

document.querySelector('#booking-prices').addEventListener('change', (event: Event) => {
  updateSelectedEntities((event.target as HTMLSelectElement).value, 'price')
  showConfirmButton()
})

document.querySelector('#add-booking-button').addEventListener('click', () => showNewBookingForm())

document.querySelector('#confirm-booking-button').addEventListener('click', () => addBooking())