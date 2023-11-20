import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import configObject from "./common.js";
import createCardModel from "../models/tenant/card.model.js";
import createCardEventModel from "../models/tenant/cardEvent.model.js";
import createElevatorModel from "../models/tenant/elevator.model.js";
import createManagerModel from "../models/tenant/manager.model.js";
import createUserModel from "../models/tenant/user.model.js";
import { config } from "dotenv";
config();
// Uncomment the line below once you've converted the `school.model` file into an ES module too.
// import dataBaseSchema from "../models/school.model";

// Object holding all your connection strings.
global.DBConnectionsList = {};

/**
 * 1. Get DB Name from the header part.
 * 2. Check the DB Connection is available in 'DBConnectionsList' else Create new DBconnection.
 * 3. After creating new Connection Load All models under db connection and store it 'DBConnectionsList'.
 */
const authorizeDB = function (req, res, next) {
  console.log("User Db Connection Process.....");

  //Get DB name from the header(token).
  const header = req.get("Authorization");
  if (!header) {
    return next();
  }

  // Check the DB Connection is available in 'DBConnectionsList' else Create new DB connection.
  if (header) {
    console.log("Authorization header verified.");
    const tokenType = header.split(" ")[0];
    const token = header.split(" ")[1];
    if (tokenType && token) {
      if (tokenType === "Bearer") {
        jwt.verify(
          token,
          configObject.secret,
          { issuer: configObject.issuer },
          (err, decodedToken) => {
            if (err) {
              return res.status(401).send("You are not an Authorized user.");
            }
            if (decodedToken.CName) {
              const dbName = `${process.env.MONGODB_PREFIX}${decodedToken.CName}`;
              if (DBConnectionsList[dbName]) {
                console.log("DB in Connection List.....");
                return next();
              } else {
                DBConnectionsList[dbName] = mongoose.createConnection(
                  `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/` +
                    dbName
                );
                // Load All models under db connection and store it 'DBConnectionsList'.
                // Uncomment the line below once you've converted the `school.model` file into an ES module and imported it.
                DBConnectionsList[dbName]["cardModel"] = createCardModel(
                  DBConnectionsList[dbName]
                );
                DBConnectionsList[dbName]["cardEventModel"] =
                  createCardEventModel(DBConnectionsList[dbName]);
                DBConnectionsList[dbName]["elevatorModel"] =
                  createElevatorModel(DBConnectionsList[dbName]);
                DBConnectionsList[dbName]["managerModel"] = createManagerModel(
                  DBConnectionsList[dbName]
                );
                DBConnectionsList[dbName]["userModel"] = createUserModel(
                  DBConnectionsList[dbName]
                );
                console.log("New DB added in Connection List.....");
                return next();
              }
            } else {
              return res.status(401).send("You are not an Authorized user.");
            }
          }
        );
      } else {
        return res.status(401).send("You are not an Authorized user.");
      }
    } else {
      return res.status(401).send("You are not an Authorized user.");
    }
  } else {
    return next();
  }
};

export { authorizeDB };
