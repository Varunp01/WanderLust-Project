const User= require("../models/user");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async (req,res)=>{
    try {
        let {username, email, password}=req.body;
        const newUser=new User({email, username});
        const registereduser= await User.register(newUser, password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
               return next(err);
            }})
        req.flash("success", "Welcome to WANDERLUST!");
        res.redirect("/listings");           
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");        

    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success", "Welcome, You are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout= (req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "successfully logged out!!");
        res.redirect("/listings");
    })
}