module.exports = {
    ensureAuthenicated: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }

        req.flash('error_msg', "You can't access this page")
        res.redirect('/users/login')
    }
}

