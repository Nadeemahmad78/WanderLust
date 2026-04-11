
require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.LOCAL_DB_URL || "mongodb://127.0.0.1:27017/wanderlust";

// 👇 REAL USER ID (jo tumne DB me dikhayi hai)
const OWNER_ID = new mongoose.Types.ObjectId(
  "696cda5a8400eb4619bccecd"
);

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    await initDB();
  } catch (err) {
    console.log(err);
  }
}

const initDB = async () => {
  // purani listings delete
  await Listing.deleteMany({});

  // har listing me owner set
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "696cda5a8400eb4619bccecd",
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("Data was initialized");
};

main();
