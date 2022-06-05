const dotenv = require("dotenv");
const log4js = require("log4js");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", routes);

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: "auto" }));

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

log4js.configure({
  appenders: {
    console: { type: "console" },
    carousal_service: {
      type: "file",
      filename: "logs/carousal_service.log",
    },
  },
  categories: {
    default: {
      appenders: ["carousal_service", "console"],
      level: "debug",
    },
  },
});

let log = log4js.getLogger("carousal_service");

database.on("error", (error) => {
  log.info("Databse connection error", error);
});

database.once("connected", () => {
  log.info("Database Connected");
});

const server = app.listen(3600, function () {
  const host = server.address().address;
  const port = server.address().port;
  log.info("node service started ", host, port);
});
