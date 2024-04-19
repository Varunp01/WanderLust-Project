if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
// console.log(process.env);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError.js");
// const wrapAsync=require("./utils/wrapAsync.js");
// const Listing=require("./models/listing.js");
// const Review=require("./models/reviews.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const flash=require("connect-flash");

const MongoStore = require('connect-mongo');
const session=require("express-session");

const store=MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET
      },
    touchAfter: 24*3600
});
store.on("error", ()=>{
    console.log("ERROR in MONGO session STORE", err);
});
const sessionOptions={
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}
app.use(session(sessionOptions));

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.currUser);
    // console.log(req.path);
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//lisitng routes
const listingRouter=require("./routes/listing.js");
//reviews routes
const reviewRouter=require("./routes/review.js");
//user signup route
const userRouter=require("./routes/user.js");


//schema validator-joi and then passed as middleware
// const Joi = require('joi');  //done in schema.js
const {listingSchema, reviewSchema} = require("./schema.js");  


//ejs-mate
const ejsMate=require("ejs-mate");
const Joi = require("joi");
app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));



async function main() {
    // await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');    
    await mongoose.connect(process.env.ATLASDB_URL);   //6IJfDCcowOniLGIZ
};

main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});


//fake user
// app.get("/demouser", async (req,res)=>{
//     let fakeUser= new User({
//         email: "student@gmail.com",
//         username: "apna"
//     });

//     let registeredUser=await User.register(fakeUser,"helloworld");   //(user,password)
//     res.send(registeredUser);
// });


//lisitng route
app.use("/listings",listingRouter);

//reviews
app.use("/listings/:id/reviews",reviewRouter);
//user signup
app.use("/",userRouter);


//default routes
// app.get("/",(req,res)=>{
//     res.send("welcome to root page");
// });

app.listen(8080,()=>{
    console.log("server started");
});

//use these middleware at last
//middleware for error handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let { statusCode=500, message='Kuch to hua hai, Kuch ho gya hai'}=err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
});
