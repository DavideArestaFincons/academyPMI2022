import { Booking, Court, Customer } from './classes.js'
import { state } from './main.js'

let timerInterval = setInterval(refreshBookingsEventDispatch, 5000)

export function listBookings(bookings = []) {
  let bookingsListHtml = 'Nessuna prenotazione presente'
  if (bookings.length > 0) {
      bookingsListHtml = '<ul class="list-unstyled">'
      bookings.forEach(booking => {
          bookingsListHtml += '<li>'
          bookingsListHtml += 'Data: <strong>' + booking.date.toLocaleDateString('it') + '</strong> '
          bookingsListHtml += '</li>'
          bookingsListHtml += '<li>'
          bookingsListHtml += 'Ora di inizio: ' + booking.from.toLocaleDateString('it') + ' '
          bookingsListHtml += '</li>'
          bookingsListHtml += '<li>'
          bookingsListHtml += 'Ora di fine: ' + booking.to.toLocaleDateString('it') + ' '
          bookingsListHtml += '</li>'
          bookingsListHtml += '<li>'
          bookingsListHtml += 'Prezzo: ' + booking.price + ' '
          bookingsListHtml += '</li>'
          bookingsListHtml += '<li>'
          bookingsListHtml += 'Numero giocatori: ' + booking.players + ' '
          bookingsListHtml += '</li>'
          bookingsListHtml += '<li>'
          bookingsListHtml += 'Prenotato da : <strong>' + booking.bookedBy.naming() + '</strong> '
          bookingsListHtml += '</li>'
      })
      bookingsListHtml += '</ul>'
  }

  return bookingsListHtml
}

export async function showNewBookingForm() {
  document.querySelector('#customer-list').classList.add('visible')
  document.querySelector('#new-booking').classList.add('visible')
  document.querySelector('#add-booking-button').classList.remove('visible')

  state.customers = (await getEntitiesFromFile('./customers.json')).map(c => new Customer(c.id, c.firstname, c.lastname, c.birthDate, c.phoneNumber, c.email))
  buildEntityList(state.customers, '#booking-costumers')
 
}

export async function getEntitiesFromFile(url) {
  return await fetch(url).then(r => r.json())
}

export function updateSelectedEntities(value, entityName) {
  state.selectedEntities[entityName] = value
}

export async function showCourts(value, divSelector, selectSelector) {
  if (value != -1) {
      document.querySelector(divSelector).classList.add('visible')
      state.courts = (await getEntitiesFromFile('./courts.json')).map(c => new Court(c.id, c.name, c.ground, c.type, c.prices))
      buildEntityList(state.courts, selectSelector)
  }

}

export function showPrices(value, divSelector, selectSelector) {
  if (value != -1) {
      document.querySelector(divSelector).classList.add('visible')
      buildEntityList(getPricesByCourt(), selectSelector)
  }
  

}

export async function addBooking() {
  const bookingPrice = state.prices.find(p => p.id == state.selectedEntities.price)
  const bookingCustomer = state.customers.find(c => c.id == state.selectedEntities.customer)
  const bookingCourt = state.courts.find(c => c.id == state.selectedEntities.court)
  const booking = new Booking(state.bookings.length + 1, new Date(), bookingPrice.fromDate, bookingPrice.toDate, bookingPrice.value, 2, bookingCustomer, bookingCourt)

  try {
      if (!getBookingByDatesAndCourt(booking)) {
          if (window.confirm('Sei sicuro di confermare la prenotazione?')) {
              document.querySelector('.overlay').style.display='block'

              clearInterval(timerInterval)
              await saveBookings(booking)
              await refreshBookings()
          }
      } else {
          throw new Error('Prenotazione con gli stessi parametri già esistente nel sistema')
      }
  } catch (error) {
      console.error('C\'è un grosso errore!!!!');
      alert(error)
  }
}

export async function refreshBookings(){
  setTimeout(() => {
      refreshBookingsEventDispatch()
      document.querySelector('.overlay').style.display='none'
      timerInterval = setInterval(refreshBookingsEventDispatch, 5000)
  }, 2000)
}

export async function saveBookings(booking){
  setTimeout(() => {
    clearStatus()
    state.bookings.push(booking)
  }, 1000)
}

export function refreshBookingsEventDispatch() {
  const refreshEvent = new Event('RefreshBookings')
  dispatchEvent(refreshEvent)
}

export function showConfirmButton() {
  document.querySelector('#confirm-booking-button').classList.add('visible')
}

export function getPricesByCourt() {
  return state.courts.find(c => c.id == state.selectedEntities.court).prices
}

export function clearStatus() {
  state.selectedEntities.customer = null
  state.selectedEntities.court = null
  state.selectedEntities.price = null
  document.querySelectorAll('#court-list,#price-list,#customer-list,#confirm-booking-button,#add-booking-button').forEach(elem => elem.classList.toggle('visible'))
}

export function buildEntityList(entityList, selector) {
  let resultHtml = '<option value="-1"></option>'
  if (entityList.length) {
      entityList.forEach(entity => {
          resultHtml += '<option value="' + entity.id + '">' + entity.naming() + '</option>'

      })
  }
  fillHtmlElem(selector, resultHtml)
}

export function fillHtmlElem(selector, content) {
  document.querySelector(selector).innerHTML = content
}

export function getBookingByDatesAndCourt(booking) {
  return state.bookings.find(b => b.from === booking.from && b.to === booking.to && b.court.id === booking.court.id)
}