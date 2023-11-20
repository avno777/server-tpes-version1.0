// import mongoose from "mongoose";
// import { config } from "dotenv";
// import { loadTenantModels } from "./loadModels.helper.js"; // centralized model loader

// config();

// /**
//  * Creates a new database with tenant-specific models if it doesn't already exist.
//  *
//  * @param {string} userDbName - Name of the user's database without any prefix.
//  * @param {function(boolean)} cb - Callback function to be called after checking/creating the database.
//  *                                Passes a boolean indicating if the database already existed (true) or was newly created (false).
//  * @returns {Promise<void>} - Resolves when the database creation/checking process is completed.
//  */
// export async function createDB(userDbName, cb) {
//   const uri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
//   const AdminDb = mongoose.createConnection(uri);

//   try {
//     const admin = new mongoose.mongo.Admin(AdminDb.db);
//     const result = await admin.listDatabases();
//     const dbExists = result.databases.some(
//       (db) => db.name === `${process.env.MONGODB_PREFIX}_${userDbName}`
//     );

//     if (dbExists) {
//       console.log(`DB ${db.name} already exists.`);
//       cb(true);
//     } else {
//       const newUserDb = mongoose.createConnection(
//         `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_PREFIX}${userDbName}`
//       );
//       loadTenantModels(newUserDb);
//       console.log("Database and collections created for:", userDbName);
//       cb(false);
//     }
//   } catch (error) {
//     console.error("Error during database creation:", error);
//   } finally {
//     AdminDb.close();
//   }
// }

import mongoose from "mongoose";
import { config } from "dotenv";
import { loadTenantModels } from "./loadModels.helper.js";

config();

/**
 * Create a new database based on the given project name and level 2 user name.
 *
 * @param {string} projectName - The name of the project.
 * @param {string} level2UserName - The name of the level 2 user.
 * @param {function(boolean)} cb - Callback function. Passes a boolean indicating if the database already existed (true) or was newly created (false).
 * @returns {Promise<void>} Resolves when the database creation/checking process is completed.
 */
export async function createDB(projectName, level2UserName, cb) {
  const userDbName = `${projectName}_${level2UserName}`;
  const uri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
  const AdminDb = mongoose.createConnection(uri);

  try {
    const admin = new mongoose.mongo.Admin(AdminDb.db);
    const result = await admin.listDatabases();
    const dbExists = result.databases.some(
      (db) => db.name === `${process.env.MONGODB_PREFIX}_${userDbName}`
    );

    if (dbExists) {
      console.log(`DB ${db.name} already exists.`);
      cb(true);
    } else {
      const newUserDb = mongoose.createConnection(
        `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_PREFIX}${userDbName}`
      );
      loadTenantModels(newUserDb);
      console.log("Database and collections created for:", userDbName);
      cb(false);
    }
  } catch (error) {
    console.error("Error during database creation:", error);
  } finally {
    AdminDb.close();
  }
}
