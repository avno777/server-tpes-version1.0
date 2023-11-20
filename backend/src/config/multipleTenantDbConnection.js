// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import configObject from "./common.js";
// import { config } from "dotenv";
// import { loadTenantModels } from "../helpers/loadModels.helper.js"; // assuming you'll create a centralized model loader

// config();

// /**
//  * Manages tenant-specific database connections and model loading.
//  */
// class ConnectionManager {
//   constructor() {
//     /**
//      * A dictionary to store mongoose connections for each tenant.
//      * @type {Object.<string, {connection: mongoose.Connection, models: Object}>}
//      */
//     this.connections = {};
//   }

//   /**
//    * Fetches an existing connection or creates a new one for the given database name.
//    * @param {string} dbName - The name of the database to connect to.
//    * @returns {{connection: mongoose.Connection, models: Object}} - The mongoose connection and associated models.
//    */
//   getConnection(dbName) {
//     if (!this.connections[dbName]) {
//       const dbConnection = mongoose.createConnection(
//         `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/` +
//           dbName
//       );
//       this.connections[dbName] = {
//         connection: dbConnection,
//         models: loadTenantModels(dbConnection), // this will load all models for the tenant
//       };
//     }
//     return this.connections[dbName];
//   }
// }

// /** Singleton instance of ConnectionManager */
// export const connectionManager = new ConnectionManager();

// /**
//  * Verifies the JWT token.
//  * @param {string} token - JWT token to verify.
//  * @returns {Promise<Object>} - A promise that resolves to the decoded token if valid.
//  * @throws {string} - Throws an error if the token is invalid.
//  */
// const verifyToken = (token) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       token,
//       configObject.secret,
//       { issuer: configObject.issuer },
//       (err, decodedToken) => {
//         if (err) {
//           reject("You are not an Authorized user.");
//         } else {
//           resolve(decodedToken);
//         }
//       }
//     );
//   });
// };

// /**
//  * Middleware to authorize database based on the JWT token present in the request header.
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  * @param {function} next - Express next middleware function.
//  */
// export const authorizeDB = async function (req, res, next) {
//   const header = req.get("Authorization");
//   if (header) {
//     const [tokenType, token] = header.split(" ");
//     if (tokenType === "Bearer" && token) {
//       try {
//         const decodedToken = await verifyToken(token);
//         if (decodedToken.CName) {
//           const dbName = `${process.env.MONGODB_PREFIX}${decodedToken.CName}`;
//           connectionManager.getConnection(dbName);
//           return next();
//         } else {
//           return res.status(401).send("You are not an Authorized user.");
//         }
//       } catch (error) {
//         return res.status(401).send(error);
//       }
//     } else {
//       return res.status(401).send("You are not an Authorized user.");
//     }
//   } else {
//     return next();
//   }
// };

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import configObject from "./common.js";
import { config } from "dotenv";
import { loadTenantModels } from "../helpers/loadModels.helper.js";

config();

/**
 * Manages tenant-specific database connections and model loading.
 */
class ConnectionManager {
  constructor() {
    /**
     * A dictionary to store mongoose connections for each tenant.
     * @type {Object.<string, {connection: mongoose.Connection, models: Object}>}
     */
    this.connections = {};
  }

  /**
   * Fetches an existing connection or creates a new one for the given database name.
   *
   * @param {string} dbName - The name of the database to connect to.
   * @returns {{connection: mongoose.Connection, models: Object}} - The mongoose connection and associated models.
   */
  getConnection(dbName) {
    if (!this.connections[dbName]) {
      const dbConnection = mongoose.createConnection(
        `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/` +
          dbName
      );
      this.connections[dbName] = {
        connection: dbConnection,
        models: loadTenantModels(dbConnection),
      };
    }
    return this.connections[dbName];
  }
}

/** Singleton instance of ConnectionManager */
export const connectionManager = new ConnectionManager();

/**
 * Verifies the JWT token.
 * @param {string} token - JWT token to verify.
 * @returns {Promise<Object>} - A promise that resolves to the decoded token if valid.
 * @throws {string} - Throws an error if the token is invalid.
 */
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      configObject.secret,
      { issuer: configObject.issuer },
      (err, decodedToken) => {
        if (err) {
          reject("You are not an Authorized user.");
        } else {
          resolve(decodedToken);
        }
      }
    );
  });
};

/**
 * Middleware to authorize database based on the JWT token present in the request header.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const authorizeDB = async function (req, res, next) {
  const header = req.get("Authorization");
  const subdomain = req.subdomains[0];

  if (header && subdomain) {
    const [tokenType, token] = header.split(" ");
    if (tokenType === "Bearer" && token) {
      try {
        const decodedToken = await verifyToken(token);
        const dbName = `${subdomain}_${decodedToken.UserName}`;

        if (decodedToken.level2Databases.includes(dbName)) {
          connectionManager.getConnection(dbName);
          return next();
        } else {
          return res
            .status(401)
            .send("You are not authorized for this database.");
        }
      } catch (error) {
        return res.status(401).send(error);
      }
    } else {
      return res.status(401).send("You are not an Authorized user.");
    }
  } else {
    return next();
  }
};
