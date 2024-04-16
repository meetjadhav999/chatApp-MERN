const router = require('express').Router()
const auth = require('../middleware/auth')
const { createConversation, getConversation } = require('../controllers/conversation')


router.post('',auth,createConversation)
router.get('',auth,getConversation)

module.exports = router