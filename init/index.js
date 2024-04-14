const mongoose=require("mongoose");
const initData = require("./data.js");
const Listing=require("../models/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');    
}

main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

const initDB=async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "6610a18b0dd55a0e32fd8012"}));
    await Listing.insertMany( initData.data );
    console.log("initialized data");
}

initDB();