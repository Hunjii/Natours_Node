/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
var stripe = Stripe('pk_test_8TapejNEoMTp7PBVntpzNS1j00sC6vyZZJ');

export const bookApartment = async (apartmentId) => {
  try {
    // 1) Get checkot session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${apartmentId}`
    );

    // 2) Create checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
