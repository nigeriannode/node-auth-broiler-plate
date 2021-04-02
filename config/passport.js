const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//USER MODEL
const User = require('../schema/User')



module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'}, (email, password, done) => {
            //MATCH USER
            User.findOne({ email:email})
            .then(user => {
                if(!user){
                    return done(null, false, {message: 'That email is not registered'})
                }

                //MATCH PASSWORD
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err

                    if(isMatch){
                        return done(null, user)
                    }else{
                        return done(null, false, {message:'Wrong password'})
                    }
                })
            })
            .catch(err => console.log(err))
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

