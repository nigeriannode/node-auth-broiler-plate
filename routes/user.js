//MODULES 
const express = require('express')
const User = require('../schema/User')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')


//LOGIN ROUTE
router.get('/login', (req, res) => {
    res.render('login')
})


//REGISTER ROUTE
router.get('/register', (req, res) => {
    res.render('register')
})


//HANDLES REGISTRATION
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []


    //CHECK IF INPUT FIELDS ARE EMPTY
    if (!name || !email || !password || !password2){
        errors.push({msg:'Fill in the fields'})
    }


    //CHECK IF PASSWORDS MATCH
    if (password !== password2){
        errors.push({msg:'Passwords donot match'})
    }
    

    //CHECK PASSWORD LENGTH
    if (password.length < 6){
        errors.push({msg:'Passwords must be longer than 6 characters'})
    }

    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        User.findOne({ email:email })
        .then(user => {
            if(user){
                errors.push({msg:'Email already in use'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }else{
             
                const new_user = new User({ name , email, password})

                //ENCRYPT PASSWORD
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(new_user.password, salt, (err, hash) => {
                       if(err) throw err
                        //SET NEW PASSWORD
                        new_user.password = hash

                        new_user.save()
                        .then(user => {
                            req.flash('success_msg', 'Youre now registered')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
                    })
                })
            }
        })
    }
})


//HANDLES LOGIN 
router.post('/login', (req, res, next) => {

        const { name, email } = req.body
        const errors = []

        if (!name || !email){
            errors.push({msg:'Fill in the record fields'})
        }
        
        if(errors.length > 0){
            res.render('login', {
                errors
            })
        }else{
            passport.authenticate('local', {
                successRedirect: '/dashboard',
                failureRedirect:'/users/login',
                failureFlash: true
                
                
            })(req, res, next)
        }
    
})


//LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Logged Out Successfully ')
    res.redirect('/users/login')
})


module.exports = router