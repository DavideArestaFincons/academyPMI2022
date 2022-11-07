
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
        this.court
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


window.addEventListener('DOMContentLoaded', function () {

})

