require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../models/listing");
const { data } = require("./data");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

const demoUserId = "693f106768cd0372d70592fc"; // 👈 IMPORTANT

async function seedDB() {
  await Listing.deleteMany({});
  console.log("Cleared listings");

  for (let item of data) {
    try {
      const geoRes = await axios.get(
        "https://api.geoapify.com/v1/geocode/search",
        {
          params: {
            text: `${item.location}, ${item.country}`,
            apiKey: process.env.GEOAPIFY_API_KEY,
            limit: 1
          }
        }
      );

      if (!geoRes.data.features.length) {
        console.log(`Skipped (no location): ${item.title}`);
        continue;
      }

      const listing = new Listing({
        ...item,                 
        owner: demoUserId,       
        geometry: {
          type: "Point",
          coordinates: geoRes.data.features[0].geometry.coordinates
        }
      });

      await listing.save();
      console.log(`Added: ${item.title}`);
    } catch (err) {
      console.log(`Failed: ${item.title}`);
    }
  }

  mongoose.connection.close();
}

seedDB();
