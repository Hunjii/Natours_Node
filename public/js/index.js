/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookApartment } from './stripe';
import { signup } from './signup';
import { createReview } from './review';
import { create } from './create';

// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-room');
const menuBar = document.querySelectorAll('.side-nav li');
const reviewBtn = document.querySelector('.btn-review');
const reviewForm = document.querySelector('.form--review');
const overlay = document.querySelector('.overlay');
const svgClose = document.getElementById('svg-close');
const createForm = document.getElementById('form-create');

//const createReviewBtn = document.getElementById('btn-create-review');

// DELEGATION
if (mapBox) {
  const location = JSON.parse(mapBox.dataset.location);
  displayMap(location);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    const typeRadio = document.querySelector('input[name="typeUser"]:checked');
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const role = typeRadio.value;
    signup(email, name, password, passwordConfirm, role);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (updateDataForm) {
  updateDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    document.querySelector('.btn--update').textContent = 'Updating...';
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--update').textContent = 'Save password';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { roomId } = e.target.dataset;

    bookApartment(roomId);
  });
}

if (menuBar) {
  const resetClass = () => {
    menuBar.forEach((el) => el.classList.remove('side-nav--active'));
  };

  menuBar.forEach((el) => {
    el.addEventListener('click', () => {
      resetClass();
      el.classList.add('side-nav--active');
    });
  });
}

if (reviewBtn) {
  reviewBtn.addEventListener('click', (e) => {
    reviewForm.dataset.apartmentId = e.target.dataset.apartmentId;
    reviewForm.classList.add('active');
    overlay.classList.add('active');
  });

  svgClose.addEventListener('click', () => {
    reviewForm.classList.remove('active');
    overlay.classList.remove('active');
  });

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const { apartmentId } = e.target.dataset;
    createReview(review, rating, apartmentId);
  });
}

if (createForm) {
  createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('summary', document.getElementById('summary').value);
    form.append('description', document.getElementById('description').value);
    form.append('rules', document.getElementById('rules').value);
    form.append('guestNumber', document.getElementById('guestNumber').value);
    form.append('area', document.getElementById('area').value);
    form.append('countRoom[bedroom]', document.getElementById('bedroom').value);
    form.append(
      'countRoom[bathroom]',
      document.getElementById('bathroom').value
    );
    form.append('countRoom[bed]', document.getElementById('bed').value);
    form.append(
      'price[priceCommon]',
      document.getElementById('priceCommon').value
    );
    form.append(
      'price[priceWeekend]',
      document.getElementById('priceWeekend').value
    );
    form.append(
      'price[priceDiscount]',
      document.getElementById('priceDiscount').value
    );
    form.append(
      'typeAparment',
      document.getElementById('typeAparment').options[
        document.getElementById('typeAparment').selectedIndex
      ].value
    );
    form.append(
      'typeRoom',
      document.getElementById('typeRoom').options[
        document.getElementById('typeRoom').selectedIndex
      ].value
    );
    form.append('imageCover', document.getElementById('photo-cover').files[0]);

    const images = document.getElementById('photos').files;
    for (let i = 0; i < images.length; i++) {
      form.append('images', images[i]);
    }

    form.append(
      'location[description]',
      document.getElementById('location').value
    );
    form.append('location[address]', document.getElementById('address').value);

    const { userId } = e.target.dataset;
    form.append('host', userId);

    // const name = document.getElementById('name').value;
    // const summary = document.getElementById('summary').value;
    // const description = document.getElementById('description').value;
    // const rules = document.getElementById('rules').value;
    // const typeAparment = document.getElementById('typeAparment').options[
    //   document.getElementById('typeAparment').selectedIndex
    // ].value;
    // const typeRoom = document.getElementById('typeRoom').options[
    //   document.getElementById('typeRoom').selectedIndex
    // ].value;
    // const guestNumber = document.getElementById('guestNumber').value;
    // const area = document.getElementById('area').value;
    // const bedroom = document.getElementById('bedroom').value;
    // const bathroom = document.getElementById('bathroom').value;
    // const bed = document.getElementById('bed').value;
    // const priceCommon = document.getElementById('priceCommon').value;
    // const priceWeekend = document.getElementById('priceWeekend').value;
    // const priceDiscount = document.getElementById('priceDiscount').value;
    // const locationDescription = document.getElementById('location').value;
    // const address = document.getElementById('address').value;

    // const newApartment = {
    //   name,
    //   summary,
    //   description,
    //   rules,
    //   typeRoom,
    //   guestNumber,
    //   area,
    //   bedroom,
    //   bathroom,
    //   bed,
    //   priceCommon,
    //   priceWeekend,
    //   priceDiscount,
    //   typeAparment,
    //   location: {
    //     address,
    //     description: locationDescription,
    //   },
    // };

    //console.log(form.get('location[address]'));

    create(form);
  });
}
