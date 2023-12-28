const { error } = require("console");
const mongoose = require("mongoose");
const dns = require("dns");
const Count = require("../utils.js").Count;

const validateUrl = (url) => {
  dns.lookup(url, (err, address, family) => {
    return err ? false : true;
  });
};

const urlSchema = new mongoose.Schema({
  uid: {
    type: Number,
    unique: true,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    validate: validateUrl,
  },
});

const Url = mongoose.model("Url", urlSchema);
const urlCount = new Count(Url, mongoose);

exports.Url = Url;
exports.urlCount = urlCount;
