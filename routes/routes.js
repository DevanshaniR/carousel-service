const express = require("express");
const log4js = require("log4js");
const Model = require("../models/model");

const router = express.Router();

let log = log4js.getLogger("carousal_service");

router.get("/health", (req, res) => {
  res.status(200).contentType("application/json").send({
    environment: process.env.NODE_ENV,
    currentTimestamp: Date.now(),
    message: "Application is up and running",
  });
});

// SAVE IMAGES
//This end point is used to save slide information in mongo DB
router.post("/carousel", async (req, res) => {
  const data = new Model({
    image: req.body.image,
    title: req.body.title,
    subTitle: req.body.sub_title,
  });

  try {
    const dataToSave = await data.save();
    log.info("carousal data update success");
    res.status(200).json(dataToSave);
  } catch (error) {
    log.error("carousal data update exception", error.message);
    res.status(400).json({ message: error.message });
  }
});

// GET IMAGES
router.get("/carousel", async (req, res) => {
  try {
    log.info("GET carousel data :: no of slides", req.query.slides);
    const no_of_slides = req.query.slides > 10 ? 10 : req.query.slides;
    const data = await Model.find({}, { _id: false, __v: false })
      .select(["image", "title", "subTitle"])
      .limit(no_of_slides);
    res.json(data);
  } catch (error) {
    log.error("GET carousal data exception", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
