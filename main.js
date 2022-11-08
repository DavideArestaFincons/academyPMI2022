import { Customer, Price, Court, Booking } from './classes.js'

const customers = [new Customer(1, 'Gabriele', 'Presicci', new Date('1993-04-10'), '5346564563', 'gab@email.com'),
new Customer(2, 'Simone', 'Spadino', new Date('1994-06-13'), '34564563', 'sim@email.com')]
const prices = [new Price(1, new Date('2022-11-7'), new Date('2022-11-8'), 17.9),
new Price(2, new Date('2022-12-6'), new Date('2022-12-9'), 15.9),
new Price(3, new Date('2022-12-16'), new Date('2022-12-19'), 25)]
const courts = [new Court(1, 'One', 'Clay', 'Indoor', prices.filter((v, i) => i === 0)),
new Court(2, 'Two', 'Grass', 'Outdoor', prices.filter(v => v.id > 1))]
const bookings = []



const selectedEntities = {
    customer: null,
    court: null,
    price: null
}

function listBookings(bookings = []) {
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

function showNewBookingForm() {
    document.querySelector('#new-booking').classList.add('visible')
    document.querySelector('#add-booking-button').classList.remove('visible')
    buildEntityList(customers, '#booking-costumers')
}



function updateSelectedEntities(value, entityName) {
    selectedEntities[entityName] = value
}

function showNext(value, divSelector, selectSelector, entityList) {
    if (value != -1) {
        document.querySelector(divSelector).classList.add('visible')
        buildEntityList(entityList, selectSelector)
    }

}



function showConfirmButton() {
    document.querySelector('#confirm-booking-button').classList.add('visible')
}

function getPricesByCourt() {
    return courts.find(c => c.id == selectedEntities.court).prices
}

function addBooking() {
    const bookingPrice = prices.find(p => p.id == selectedEntities.price)
    const bookingCustomer = customers.find(c => c.id == selectedEntities.customer)
    const bookingCourt = courts.find(c => c.id == selectedEntities.court)
    const booking = new Booking(bookings.length + 1, new Date(), bookingPrice.fromDate, bookingPrice.toDate, bookingPrice.value, 2, bookingCustomer, bookingCourt)

    try {
        if (!getBookingByDatesAndCourt(booking)) {
            if (window.confirm('Sei sicuro di confermare la prenotazione?')) {
                bookings.push(booking)
                document.querySelector('.overlay').style.display='block'
                setTimeout(() => {
                    const refreshEvent = new Event('RefreshBookings')
                    dispatchEvent(refreshEvent)
                    document.querySelector('.overlay').style.display='none'
                }, 3000)
                
            }
        } else {
            throw new Error('Prenotazione con gli stessi parametri già esistente nel sistema')
        }
    } catch (error) {
        console.error('C\'è un grosso errore!!!!');
        alert(error)
    }
}

function buildEntityList(entityList, selector) {
    let resultHtml = '<option value="-1"></option>'
    if (entityList.length) {
        entityList.forEach(entity => {
            resultHtml += '<option value="' + entity.id + '">' + entity.naming() + '</option>'

        })
    }
    fillHtmlElem(selector, resultHtml)
}


function fillHtmlElem(selector, content) {
    document.querySelector(selector).innerHTML = content
}

function getBookingByDatesAndCourt(booking) {
    return bookings.find(b => b.from === booking.from && b.to === booking.to && b.court.id === booking.court.id)
}

window.addEventListener('RefreshBookings', () => {
    const content = listBookings(bookings)
    fillHtmlElem('#bookings-list', content)
})

document.querySelector('#booking-costumers').addEventListener('change', (event) => {
    const selectedValue = event.target.value
    updateSelectedEntities(selectedValue, 'customer')
    showNext(selectedValue, '#court-list', '#booking-courts', courts)
})

document.querySelector('#booking-courts').addEventListener('change', (event) => {
    const selectedValue = event.target.value
    updateSelectedEntities(selectedValue, 'court')
    showNext(selectedValue, '#price-list', '#booking-prices', getPricesByCourt())
})

document.querySelector('#booking-prices').addEventListener('change', (event) => {
    updateSelectedEntities(event.target.value, 'price')
    showConfirmButton()
})

document.querySelector('#add-booking-button').addEventListener('click', () => showNewBookingForm())

document.querySelector('#confirm-booking-button').addEventListener('click', () => addBooking())


console.log(customers)
console.log(prices)
console.log(courts)
const content = listBookings(bookings)
fillHtmlElem('#bookings-list', content)