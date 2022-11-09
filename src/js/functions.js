import { Booking, Court, Customer } from './classes.js';
import { selectedEntities, state } from './main.js';
//let timerInterval = setInterval(refreshBookingsEventDispatch, 5000)
export function listBookings(bookings = []) {
    let bookingsListHtml = 'Nessuna prenotazione presente';
    if (bookings.length > 0) {
        bookingsListHtml = '';
        bookings.forEach(booking => {
            bookingsListHtml += `<div class="card mx-2">
                <div class="card-body">
                    <h5 class="card-title">${booking.bookedBy.naming()} ${booking.price.formattedValue()}</h5>
                    <p class="card-text">
                        <ul class="list-unstyled">
                            <li>
                            Data: <strong> ${booking.date.toLocaleDateString('it')} </strong> 
                            </li>
                            <li>
                            Ora di inizio:  ${booking.price.fromDate.toLocaleDateString('it')} 
                            </li>
                            <li>
                            Ora di fine:  ${booking.price.toDate.toLocaleDateString('it')}  
                            </li>
                            <li>
                            Numero giocatori:  ${booking.players}
                            </li>
                        </ul>
                    </p>
                    <button type="button" class="btn btn-warning edit-booking" data-booking-id="${booking.id}">Modifica</button>
                    <button type="button" class="btn btn-danger delete-booking" data-booking-id="${booking.id}">Elimina</button>
                </div>
            </div>`;
        });
    }
    return bookingsListHtml;
}
export function editExistingBookingForm(bookingId) {
    const booking = state.bookings.find((booking) => booking.id === bookingId);
    updateSelectedEntities(booking.bookedBy.id.toString(), 'customer');
    updateSelectedEntities(booking.price.id.toString(), 'price');
    updateSelectedEntities(booking.court.id.toString(), 'court');
    updateSelectedEntities(booking.id, 'booking');
    document.querySelector('#customer-list').classList.add('visible');
    document.querySelector('#booking-costumers').value = selectedEntities.customer;
    document.querySelector('#court-list').classList.add('visible');
    document.querySelector('#booking-courts').value = selectedEntities.court;
    buildEntityList(getPricesByCourt(), '#booking-prices');
    document.querySelector('#price-list').classList.add('visible');
    document.querySelector('#booking-prices').value = selectedEntities.price;
    document.querySelector('#add-booking-button').classList.remove('visible');
    document.querySelector('#confirm-booking-button').classList.add('visible');
}
export async function showNewBookingForm() {
    document.querySelector('#customer-list').classList.add('visible');
    document.querySelector('#new-booking').classList.add('visible');
    document.querySelector('#add-booking-button').classList.remove('visible');
    state.customers = (await getEntitiesFromFile('./customers.json')).map(c => new Customer(c.id, c.firstname, c.lastname, c.birthDate, c.phoneNumber, c.email));
    buildEntityList(state.customers, '#booking-costumers');
}
export async function getEntitiesFromFile(url) {
    return await fetch(url).then(r => r.json());
}
export function updateSelectedEntities(value, entityName) {
    state.selectedEntities[entityName] = value;
}
export async function showCourts(value, divSelector, selectSelector) {
    if (value != '-1') {
        document.querySelector(divSelector).classList.add('visible');
        state.courts = (await getEntitiesFromFile('./courts.json')).map(c => new Court(c.id, c.name, c.ground, c.type, c.prices));
        buildEntityList(state.courts, selectSelector);
    }
}
export function showPrices(value, divSelector, selectSelector) {
    if (value != '-1') {
        document.querySelector(divSelector).classList.add('visible');
        buildEntityList(getPricesByCourt(), selectSelector);
    }
}
export async function addBooking() {
    const bookingPrice = state.prices.find(p => p.id == state.selectedEntities.price);
    const bookingCustomer = state.customers.find(c => c.id == state.selectedEntities.customer);
    const bookingCourt = state.courts.find(c => c.id == state.selectedEntities.court);
    let booking;
    if (selectedEntities.booking === null) {
        booking = new Booking(state.bookings.length + 1, new Date(), bookingPrice, 2, bookingCustomer, bookingCourt);
    }
    else {
        booking = state.bookings.find((booking) => booking.id === selectedEntities.booking);
        booking.update(bookingPrice, bookingCustomer, bookingCourt);
    }
    try {
        if (!getBookingByDatesAndCourt(booking, selectedEntities.booking)) {
            if (window.confirm('Sei sicuro di confermare la prenotazione?')) {
                const overlay = document.querySelector('.overlay');
                overlay.style.display = 'block';
                //terval(timerInterval)
                await saveBookings(booking, selectedEntities.booking);
                await refreshBookings();
            }
        }
        else {
            throw new Error('Prenotazione con gli stessi parametri già esistente nel sistema');
        }
    }
    catch (error) {
        console.error('C\'è un grosso errore!!!!');
        alert(error);
    }
}
export async function refreshBookings() {
    setTimeout(() => {
        refreshBookingsEventDispatch();
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'none';
        //timerInterval = setInterval(refreshBookingsEventDispatch, 5000)
    }, 2000);
}
export async function saveBookings(booking, existingId) {
    setTimeout(() => {
        if (existingId !== null) {
            let existingBookingIndex = state.bookings.findIndex((b) => b.id === existingId);
            state.bookings[existingBookingIndex] = booking;
            console.log('modifica esistente');
        }
        else {
            state.bookings.push(booking);
        }
        clearStatus();
    }, 1000);
}
export function refreshBookingsEventDispatch() {
    const refreshEvent = new Event('RefreshBookings');
    dispatchEvent(refreshEvent);
}
export function showConfirmButton() {
    document.querySelector('#confirm-booking-button').classList.add('visible');
}
export function getPricesByCourt() {
    return state.courts.find(c => c.id == state.selectedEntities.court).prices;
}
export function clearStatus() {
    state.selectedEntities.customer = null;
    state.selectedEntities.court = null;
    state.selectedEntities.price = null;
    selectedEntities.booking = null;
    document.querySelectorAll('#court-list,#price-list,#customer-list,#confirm-booking-button,#add-booking-button').forEach(elem => elem.classList.toggle('visible'));
}
export function buildEntityList(entityList, selector) {
    let resultHtml = '<option value="-1"></option>';
    if (entityList.length) {
        entityList.forEach((entity) => {
            resultHtml += '<option value="' + entity.id + '">' + entity.naming() + '</option>';
        });
    }
    fillHtmlElem(selector, resultHtml);
}
export function fillHtmlElem(selector, content) {
    document.querySelector(selector).innerHTML = content;
}
export function getBookingByDatesAndCourt(booking, existingId) {
    const overlappingBooking = state.bookings.find((b) => b.price.id === booking.price.id && b.court.id === booking.court.id);
    if (existingId !== null && overlappingBooking) {
        if (existingId === overlappingBooking.id) {
            return null;
        }
    }
    return overlappingBooking;
}
//# sourceMappingURL=functions.js.map