import { Price } from './classes.js'
import { listBookings, fillHtmlElem, getEntitiesFromFile } from './functions.js'

let customers = []
let prices = (await getEntitiesFromFile<Price[]>('./prices.json')).map(p => new Price(p.id, new Date(p.fromDate), new Date(p.toDate), p.value))
let courts = []
let bookings = []

const selectedEntities = {
    customer: null,
    court: null,
    price: null
}

export const state = {
    customers,
    prices,
    courts,
    bookings,
    selectedEntities
}
console.log(state)

console.log(customers)
console.log(prices)
console.log(courts)
const content = listBookings(bookings)
fillHtmlElem('#bookings-list', content)
