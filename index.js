require("dotenv").config();
// require("./connection.js");
const express = require("express");
const cors = require("cors");
const validator = require("validator");
const bodyParser = require("body-parser");
const app = express();

const { Url, urlCount } = require("./models/url.js");
const { createAndSaveDoc, findOneDoc } = require("./connection.js");

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const validUrl = (req, res, next) => {
  if (!validator.isURL(req.body.url)) res.json({ error: "invalid url" });
  next();
};
const ensureUniqueUrl = async (req, res, next) => {
  const cond = { url: req.body.url };
  try {
    const doc = await findOneDoc(Url, cond, (data) => data);
    if (doc) res.json({ original_url: doc.url, short_url: doc.uid });
    else return next();
  } catch (err) {
    res.json({ error: err.message });
  }
};

// POST [project_url]/api/shorturl
app.post("/api/shorturl", validUrl, ensureUniqueUrl, async (req, res) => {
  let uid,
    url = req.body.url;
  const isInit = await urlCount.init();
  if (!isInit) res.json({ error: "Unable to initialize count" });

  uid = urlCount.count + 1;

  try {
    const doc = await createAndSaveDoc(Url, { url, uid }, (data) => {
      urlCount.increment();
      console.log("after insert: ", urlCount.count);
      return data;
    });
    res.json({ original_url: doc.url, short_url: doc.uid });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// GET [project_url]/api/shorturl/:uid
app.get("/api/shorturl/:uid", async (req, res) => {
  const cond = { uid: req.params.uid };
  try {
    const doc = await findOneDoc(Url, cond, (data) => data);
    if (!doc) res.json({ error: "not found" });
    res.redirect(doc.url);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
