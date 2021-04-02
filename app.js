const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const exphbs = require('express-handlebars')
const passport = require('passport')


//INITIALIZE APP
const app = express()

//PASSPORT CONFIG
require('./config/passport')(passport)


//EJS
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//MONGO DB INIT
const db = require('./config/keys').MongoURL
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(() => console.log('MongoDb Connected...'))
.catch(err => console.log(err))


//BODY PARSER
app.use(express.urlencoded({ extended:false }))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//EXPRESS SESSION
app.use(session({
    secret:'keyboard cat',
    resave: true,
    saveUninitialized: true
    
}))


//PASSPORT AUTHENTICATION
//ALWAYS MAKE SURE TO PUT IT AFTER THE EXPRESS SESSION MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())


//CONNECT FLASH MIDDLEWARE
app.use(flash())

//GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})


//INIT ROUTERS
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/user'))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`)
})