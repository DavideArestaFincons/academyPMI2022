import { listBookings, addBooking, fillHtmlElem, showConfirmButton, showCourts, showNewBookingForm, showPrices, updateSelectedEntities, editExistingBookingForm } from './functions.js';
import { state } from './main.js';
window.addEventListener('RefreshBookings', () => {
    const content = listBookings(state.bookings);
    fillHtmlElem('#bookings-list', content);
    addEditListener();
});
document.querySelector('#booking-costumers').addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    updateSelectedEntities(selectedValue, 'customer');
    showCourts(selectedValue, '#court-list', '#booking-courts');
});
document.querySelector('#booking-courts').addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    updateSelectedEntities(selectedValue, 'court');
    showPrices(selectedValue, '#price-list', '#booking-prices');
});
document.querySelector('#booking-prices').addEventListener('change', (event) => {
    updateSelectedEntities(event.target.value, 'price');
    showConfirmButton();
});
document.querySelector('#add-booking-button').addEventListener('click', () => showNewBookingForm());
document.querySelector('#confirm-booking-button').addEventListener('click', () => addBooking());
function addEditListener() {
    document.querySelectorAll('.edit-booking').forEach(booking => {
        booking.removeEventListener('click', () => { });
        booking.addEventListener('click', (event) => {
            editExistingBookingForm(Number.parseInt(event.target.dataset['bookingId']));
        });
    });
}
//# sourceMappingURL=listeners.js.map