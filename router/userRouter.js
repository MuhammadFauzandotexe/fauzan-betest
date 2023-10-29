const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.route('/users')
    .get(userController.findAll)
    .post (userController.save)
router.route('/users/:id')
    .get(userController.findById)
    .delete(userController.deleteById)
    .put(userController.updateById)
router.route('/users/account-number/:accountNumber')
    .get(userController.findByAccountNumber)
router.route('/users/identity-number/:identityNumber')
    .get(userController.findByIdentityNumber)
module.exports = router
