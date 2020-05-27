const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Router for auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
// Router for User

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateByUser',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateByUser
);
router.delete(
  '/deleteByUser',
  authController.protect,
  userController.deleteByUser
);

// Router for admin
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
