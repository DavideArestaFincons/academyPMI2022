
class Customer {

    constructor(id, firstname, lastname, birthDate, phoneNumber, email) {
        this.id = id
        this.firstname = firstname
        this.lastname = lastname
        this.birthDate = birthDate
        this.phoneNumber = phoneNumber
        this.email = email
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
}

class Price {
    constructor(id, fromDate, toDate, value) {
        this.id = id
        this.fromDate = fromDate
        this.toDate = toDate
        this.value = value
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

