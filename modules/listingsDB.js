// modules/listingsDB.js
const mongoose     = require('mongoose');
const Listing      = require('./listingSchema');  // now returns the Model

class ListingsDB {
  async initialize(connectionString) {
    await mongoose.connect(connectionString);
  }

  async addNewListing(data) {
    const listing = new Listing(data);
    const doc = await listing.save();
    return doc._id;
  }

  async getAllListings(page = 1, perPage = 10, name) {
    const filter = name ? { name: new RegExp(name, 'i') } : {};
    return Listing.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
  }

  async getListingById(id) {
    return Listing.findById(id).exec();
  }

  async updateListingById(data, id) {
    await Listing.updateOne({ _id: id }, { $set: data }).exec();
  }

  async deleteListingById(id) {
    await Listing.deleteOne({ _id: id }).exec();
  }
}

module.exports = ListingsDB;
