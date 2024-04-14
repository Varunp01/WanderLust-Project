const { listingSchema, reviewSchema } = require("./schema.js");  
const ExpressError=require("./utils/ExpressError.js");
const Listing=require("./models/listing");
const Review=require("./models/reviews");

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    // console.log("listing.owner._id");
    // console.log(listing.owner.toString());
    // console.log("res.locals.currUser");
    // console.log(req.user.id);
    if (listing.owner.toString() !== req.user.id) {
        req.flash("error", "you don't have permission to edit");
        res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id, reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser.id)) {
        req.flash("error", "you can't delete others review");
        res.redirect(`/listings/${id}`);
    }
    next();
};

// using Joi and then passing this as middleware
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(", ");
        console.log(error);
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// using Joi and then passing this as middleware
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(", ");
        console.log(error);
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};