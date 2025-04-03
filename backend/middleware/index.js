const isLoggedIn = (req, res, next) => {
    console.log("Auth Check - Session User:", req.session.user);
    console.log("Auth Check - Passport User:", req.user);
    
    if (req.isAuthenticated() || req.session.user) {
        return next();
    }
    
    req.flash("error", "Please login first");
    res.redirect("/login");
}; 