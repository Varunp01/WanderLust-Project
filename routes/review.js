const express=require("express");
// const router=express.Router();   //the id from parent url in app.js is not transfered to this page
const router=express.Router({ mergeParams: true });

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");
const reviewController=require("../controllers/reviews.js")










//post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;