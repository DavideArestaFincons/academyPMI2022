import { Customer, Price, Court, Booking } from './classes.js'

let customers = []
let prices = []
let courts = []
let bookings = []



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
    document.querySelector('#customer-list').classList.add('visible')
    document.querySelector('#new-booking').classList.add('visible')
    document.querySelector('#add-booking-button').classList.remove('visible')
    getEntitiesFromFile('./customers.json').then(customersResponse => {
        customers = customersResponse.map(c => new Customer(c.id, c.firstname, c.lastname, c.birthDate, c.phoneNumber, c.email))
        buildEntityList(customers, '#booking-costumers')
    })
   
}



function getEntitiesFromFile(url) {
    return fetch(url).then(r => r.json())
}

getEntitiesFromFile('./prices.json').then(pricesResponse => {
    prices = pricesResponse.map(p => new Price(p.id, new Date(p.fromDate) , new Date(p.toDate) , p.value)) 
})    

function updateSelectedEntities(value, entityName) {
    selectedEntities[entityName] = value
}

function showCourts(value, divSelector, selectSelector) {
    if (value != -1) {
        document.querySelector(divSelector).classList.add('visible')
        getEntitiesFromFile('./courts.json').then(courtsResponse => {
            courts = courtsResponse.map(c => new Court(c.id, c.name, c.ground, c.type, c.prices)) 
            buildEntityList(courts, selectSelector)
        })
    }

}

function showPrices(value, divSelector, selectSelector) {
    if (value != -1) {
        document.querySelector(divSelector).classList.add('visible')
        console.log(courts)
        buildEntityList(getPricesByCourt(), selectSelector)
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
                document.querySelector('.overlay').style.display='block'

                clearInterval(timerInterval)
                setTimeout(() => {
                    clearStatus()
                    bookings.push(booking)

                    setTimeout(() => {
                        refreshBookingsEventDispatch()
                        document.querySelector('.overlay').style.display='none'
                        timerInterval = setInterval(refreshBookingsEventDispatch, 5000)
                    }, 2000)
                }, 1000)
                
            }
        } else {
            throw new Error('Prenotazione con gli stessi parametri già esistente nel sistema')
        }
    } catch (error) {
        console.error('C\'è un grosso errore!!!!');
        alert(error)
    }
}

function refreshBookingsEventDispatch() {
    const refreshEvent = new Event('RefreshBookings')
    dispatchEvent(refreshEvent)
}

function clearStatus() {
    selectedEntities.customer = null
    selectedEntities.court = null
    selectedEntities.price = null
    document.querySelectorAll('#court-list,#price-list,#customer-list,#confirm-booking-button,#add-booking-button').forEach(elem => elem.classList.toggle('visible'))
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
    showCourts(selectedValue, '#court-list', '#booking-courts')
})

document.querySelector('#booking-courts').addEventListener('change', (event) => {
    const selectedValue = event.target.value
    updateSelectedEntities(selectedValue, 'court')
    showPrices(selectedValue, '#price-list', '#booking-prices')
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
let timerInterval = setInterval(refreshBookingsEventDispatch, 5000)
