import { Booking, Price } from './classes.js'
import { listBookings, addBooking, fillHtmlElem, showConfirmButton, showCourts, showNewBookingForm, showPrices, updateSelectedEntities, editExistingBookingForm, deleteBooking } from './functions.js'
import { state } from './main.js'

window.addEventListener('RefreshBookings', () => {
  const content = listBookings(state.bookings)
  fillHtmlElem('#bookings-list', content)
  addEditListener()
  addDeleteListener()
  let gain = '0€';
  if (state.bookings.length > 0) {
    gain = String(state.bookings.map((b : Booking) => b.price.value).reduce((p: number, c: number) => p+c))+'€'
  }
  fillHtmlElem('#total-money-gained>h4>strong', gain)
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

function addEditListener() {
  document.querySelectorAll('.edit-booking').forEach(booking => {
    booking.removeEventListener('click', () => {})
    booking.addEventListener('click', (event: Event) => {
      editExistingBookingForm(Number.parseInt((event.target as HTMLButtonElement).dataset['bookingId']))
    })
  })
}

function addDeleteListener(){
  document.querySelectorAll('.delete-booking').forEach(booking => {
    booking.removeEventListener('click', () => {})
    booking.addEventListener('click', (event: Event) => {
      deleteBooking(Number.parseInt((event.target as HTMLButtonElement).dataset['bookingId']))
    })
  })
}