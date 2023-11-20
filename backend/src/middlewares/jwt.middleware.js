import jwt from "jsonwebtoken";
import configObject from "../config/common.js";
import { config } from "dotenv";
config();

function jwtVerify(req, next) {
  console.log("jwt verify.....");
  let header = req.get("Authorization");
  let DBName;
  if (header) {
    DBName = `${process.env.MONGODB_PREFIX}${
      jwtDecode(header).decodedToken.CName
    }`;
  } else {
    console.log("header not found.");
    return next();
  }
  return DBName;
}

function permission(req, res, next, permissions) {
  console.log("Checking permissions.....");
  let header = req.get("Authorization");
  if (header) {
    /**
     * Here, the code is using the HGETALL function of the redisClient to retrieve all the fields
     * and values of a hash stored in Redis.
     * The key for the hash is determined by decoding the JWT token found in the header
     * and extracting its token value.
     */
    redisClient.HGETALL(jwtDecode(header).token, function (err, reply) {
      if (err) {
        return res.status(401).send("You are not an Authorized user.");
      }
      if (
        reply !== null &&
        reply !== undefined &&
        reply.Permission !== undefined
      ) {
        console.log("redisData");
        let redisData = reply.Permission.split(",");
        console.log(redisData);
        if (redisData.indexOf(permissions) != -1) {
          console.log(redisData.Permission);
          return next();
        } else {
          return res.status(401).send("You are not an Authorized user.");
        }
      } else {
        console.log("Test err..");
        return res.status(401).send("You are not an Authorized user.");
      }
    });
  } else {
    return res.status(401).send("You are not an Authorized user.");
  }
}

function jwtDecode(header) {
  let jwtDecodeValue = {};
  let tokenType = header.split(" ")[0];
  let token = header.split(" ")[1];

  if (
    tokenType !== undefined &&
    token !== undefined &&
    tokenType !== "" &&
    token !== ""
  ) {
    if (tokenType === "Bearer") {
      jwt.verify(
        token,
        configObject.secret,
        { issuer: configObject.issuer },
        function (err, decodedToken) {
          jwtDecodeValue.decodedToken = decodedToken;
          jwtDecodeValue.token = token;
        }
      );
    }
  }
  return jwtDecodeValue;
}

export { jwtVerify, permission };
