const Listing=require("../models/listing");

module.exports.index = async (req,res)=>{
    // console.log("HELLO");
    const allListings=await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
};

module.exports.rendernewForm =(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");        
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;

    // let {title, description, image, price, country, location}=req.body;
    // // let listing=req.body.listing;
    // // new listing(listing);
        const newListing=new Listing(req.body.listing);
        // if(!req.body.listing){
        //     throw new ExpressError(400, "Send Valid data");
        // }
        newListing.owner=req.user._id;
        newListing.image={url, filename};
        await newListing.save();
        req.flash("success","New listing created!");
        res.redirect("/listings");        
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");        
    }
    let originalImageUrl=listing.image.url;
    // originalImageUrl.replace("/upload","/upload/h_300,w_350");
    res.render("listings/edit.ejs",{ listing, originalImageUrl });
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send Valid data");
    // }
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url, filename};
        await listing.save();
    }
    req.flash("success","listing updated!");

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    console.log("deleted");
    req.flash("success","listing Deleted!");
    res.redirect("/listings");
}