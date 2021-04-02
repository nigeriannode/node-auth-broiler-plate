const express = require('express')
const router = express.Router()
const { ensureAuthenicated } = require('../config/auth')

//HANDLES THE HOME ROUTE
router.get('/', (req, res) => {
    res.render('welcome')
})


//HANDLES THE DASHBOARD ROUTE
router.get('/dashboard', ensureAuthenicated, (req, res) => res.render('dashboard', {
    name: req.user.name
    
}))

module.exports = router