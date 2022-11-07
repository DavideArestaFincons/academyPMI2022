class Customer {

    constructor(id, firstname, lastname, birthDate, phoneNumber, email) {
        this.id = id
        this.firstname = firstname
        this.lastname = lastname
        this.birthDate = birthDate
        this.phoneNumber = phoneNumber
        this.email = email
    }
    naming(){
        return this.firstname + ' ' + this.lastname 
    }
}

class Booking {
    paidOn = null
    constructor(id, date, from, to, price, players, bookedBy, court) {
        this.id = id
        this.date = date
        this.from = from
        this.to = to
        this.price = price
        this.players = players
        this.bookedBy = bookedBy
        this.court = court
    }

}

class Court {
    constructor(id, name, ground, type, prices) {
        this.id = id
        this.name = name
        this.ground = ground
        this.type = type
        this.prices = prices
    }

    naming(){
        return this.name + ' (' + this.ground + ', ' + this.type + ')'
    }
}

class Price {
    constructor(id, fromDate, toDate, value) {
        this.id = id
        this.fromDate = fromDate
        this.toDate = toDate
        this.value = value
    }

    naming(){
        return this.value +'€, ' + this.fromDate.toLocaleDateString('it')  + ' -> ' + this.toDate.toLocaleDateString('it')
    }
}

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
        bookingsListHtml = '<ul>'
        bookings.forEach(booking => {
            bookingsListHtml += '<li>'
            bookingsListHtml += 'Data: ' + booking.date + ' '
            bookingsListHtml += 'Ora di inizio: ' + booking.from + ' '
            bookingsListHtml += 'Ora di fine: ' + booking.to + ' '
            bookingsListHtml += 'Prezzo: ' + booking.price + ' '
            bookingsListHtml += 'Numero giocatori: ' + booking.players + ' '
            bookingsListHtml += 'Prenotato da : ' + booking.bookedBy + ' '
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

function updateSelectedEntities(context, entityName){
    selectedEntities[entityName] = context.value
}

function showNext(context, divSelector, selectSelector, entityList){
    if(context.value != -1){
        document.querySelector(divSelector).classList.add('visible')
        buildEntityList(entityList, selectSelector)
    }
    
}

function showConfirmButton(){
    document.querySelector('#confirm-booking-button').classList.add('visible')
}

function getPricesByCourt(){
    return courts.find(c => c.id == selectedEntities.court).prices
}

function addBooking(){
    const bookingPrice = prices.find(p => p.id == selectedEntities.price)
    const bookingCustomer = customers.find(c => c.id == selectedEntities.customer)
    const bookingCourt = courts.find(c => c.id == selectedEntities.court)
    const booking = new Booking(bookings.length+1, Date.now(), bookingPrice.fromDate, bookingPrice.toDate, bookingPrice.value, 2, bookingCustomer, bookingCourt)

    if (window.confirm('Sei sicuro di confermare la prenotazione?')){
        bookings.push(booking)
        const refreshEvent = new Event('RefreshBookings')
        dispatchEvent(refreshEvent)

        selectedEntities = {
            customer: null,
            court: null,
            price: null
        }
    }
}

function buildEntityList(entityList, selector) {
    let resultHtml = '<option value="-1"></option>'
    if (entityList.length) {
        entityList.forEach(entity => {
            resultHtml += '<option value="'+ entity.id +'">' + entity.naming() + '</option>'          

        })
    }
    fillHtmlElem(selector, resultHtml)
}


function fillHtmlElem(selector, content) {
    document.querySelector(selector).innerHTML = content
}

window.addEventListener('DOMContentLoaded', function () {
    console.log(customers)
    console.log(prices)
    console.log(courts)

    const content = listBookings(bookings)
    fillHtmlElem('#bookings-list', content)
})

window.addEventListener('RefreshBookings', function() {
    const content = listBookings(bookings)
    fillHtmlElem('#bookings-list', content)
})

