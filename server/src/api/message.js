const router = require('express').Router()
const { newMessage, getMessage } = require('../controllers/message')
const auth = require('../middleware/auth')


router.post('',auth,newMessage)
router.get('/:conversationID',auth,getMessage)
module.exports = router
