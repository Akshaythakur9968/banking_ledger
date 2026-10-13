const express = require('express')

const router = express.Router()


const authMiddleware = require('../middlewares/auth.middleware')
const acountController = require('../controllers/account.contorller')


router.post('/',authMiddleware.authMiddleware , acountController.createAccountController)


router.get('/',authMiddleware.authMiddleware , acountController.getUserAccountController)
router.get('/balance/:accountId',authMiddleware.authMiddleware , acountController.getAccountBalanceController)


module.exports = router;