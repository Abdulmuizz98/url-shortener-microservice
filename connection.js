const mongoose = require("mongoose");
const dbUri = process.env.MONGO_URI;
const connection = mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAndSaveDoc = async (model, data, done) => {
  // Callers should handle err in a try...catch
  let newDoc = new model(data);
  const doc = await newDoc.save().then(done);
  return doc;
};

const findOneDoc = async (model, condition, done) => {
  // Callers should handle err in a try...catch
  const doc = await model.findOne(condition).then(done);
  return doc;
};

exports.createAndSaveDoc = createAndSaveDoc;
exports.findOneDoc = findOneDoc;

module.export = connection;
