import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import mainDBConnection from "./config/mainDbConnection.js";
import { authorizeDB } from "./config/multiTenantConnection.js";

const app = express();
app.use(helmet());
const port = process.env.APP_PORT || 5000;

mainDBConnection();
app.use(authorizeDB);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Enable CORS
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  next();
});

app.get("/", function (req, res) {
  res.send("<h1>Begin server</h1>");
});

app.use(function errorHandler(err, req, res, next) {
  console.log("..Error Handler..");
  var ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  if (err.name === "ValidationError") {
    return res.status(400).send(err);
  }
  return res.status(500).send(err);
});

app.listen(
  port,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
