const {storage}=require("../cloudConfig.js");
const multer=require("multer");
// const upload=multer({dest: 'uploads/'});  //for local storage
const upload=multer({ storage });


const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");

const {isLoggedIn,isOwner, validateListing}= require("../middleware.js");

const listingController=require("../controllers/listings.js");

// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "my New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful listing");
// })

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn, listingController.rendernewForm);

//listings/new has to made before listings/id cause is we do the opp. /new will be considered as id for /id
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn ,isOwner ,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm));

module.exports=router;