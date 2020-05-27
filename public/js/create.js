/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// export const create = async (data, form) => {
//   try {
//     const geolocation = await axios(
//       `https://api.opencagedata.com/geocode/v1/json?q=${data.location.address}&key=d9ccb983687d44d784086367f33bd1de`
//     );

//     const res = await axios({
//       method: 'POST',
//       url: '/api/v1/apartments',
//       data: {
//         name: data.name,
//         summary: data.summary,
//         description: data.description,
//         location: {
//           description: data.location.description,
//           coordinates: [
//             geolocation.data.results[0].geometry.lng,
//             geolocation.data.results[0].geometry.lat,
//           ],
//           address: data.location.address,
//         },
//         rules: data.rules,
//         typeRoom: data.typeRoom,
//         guestNumber: data.guestNumber,
//         area: data.area,
//         bedroom: data.bedroom,
//         bathroom: data.bathroom,
//         bed: data.bed,
//         priceCommon: data.priceCommon,
//         priceWeekend: data.priceWeekend,
//         priceDiscount: data.priceDiscount,
//         typeAparment: data.typeAparment,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'create apartment successfully!');
//       window.setTimeout(() => {
//         location.assign('/my-apartments');
//       }, 2000);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

export const create = async (form) => {
  try {
    const address = form.get('location[address]');

    const geolocation = await axios(
      `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=d9ccb983687d44d784086367f33bd1de`
    );

    form.append(
      'location[coordinates][]',
      geolocation.data.results[0].geometry.lng
    );
    form.append(
      'location[coordinates][]',
      geolocation.data.results[0].geometry.lat
    );

    const res = await axios({
      method: 'POST',
      url: '/api/v1/apartments',
      data: form,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'create apartment successfully!');
      window.setTimeout(() => {
        location.assign('/my-apartments');
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
