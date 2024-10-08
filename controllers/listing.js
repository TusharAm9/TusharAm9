const Listing=require("../models/listing.js");

module.exports.Index = async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listing/index.ejs",{allListings});
};

module.exports.newListingForm = (req,res)=>{
    res.render("listing/new.ejs");
};
module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id)
    .populate({path:"reviews",
        populate: {path:"author",},
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing Doesn't Exists");
        res.redirect("/listings");
    } 
    res.render("listing/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!! ");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Doesn't Exists");
        res.redirect("/listings");
    }
    let listingImg = listing.image.url;
    listingImg = listingImg.replace("/upload","/upload/c_scale,w_300/f_auto/");
    res.render("listing/edit.ejs",{listing,listingImg});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing });
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        listing.save();
    }
    req.flash("success","Listing Updated!! ");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!! ");
    res.redirect("/listings");
}