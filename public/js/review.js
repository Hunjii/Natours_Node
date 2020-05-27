/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (review, rating, apartmentId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/apartments/${apartmentId}/reviews`,
      data: {
        review,
        rating,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'review successfully!');
      window.setTimeout(() => {
        location.assign('/my-bookings');
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
