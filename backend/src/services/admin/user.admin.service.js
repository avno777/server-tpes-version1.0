import user from "../models/user.model.mjs";
import { getJWTResult } from "./helpers/jwtHelper.mjs";
import { hashedPassword, verifyPassword } from "./helpers/passwordHelper.mjs";
import { storeDataInRedisServer } from "./helpers/redisHelper.mjs";
import { createDB } from "../../helpers/createTenantDb.helper";

export const createUserLevel2 = async (application) => {
  const result = await createDB(application.UserName);
  if (!result) {
    application.DataBaseName = application.UserName;
    application.Role = "Admin";
    application.Password = hashedPassword(application.Password);
    const newUser = await user.create(application);
    return newUser;
  } else {
    throw new Error("User Already Exists");
  }
};

export const createUserLevel1 = async (application) => {
  application.Password = hashedPassword(application.Password);
  const newUser = await user.create(application);
  return newUser;
};

export const userLogin = async (username, password) => {
  const userinfo = await user.findOne({
    UserName: new RegExp("^" + username + "$", "i"),
  });
  if (userinfo && verifyPassword(password, userinfo.Password)) {
    if (userinfo.Role == "Admin") {
      const jwtResult = await getJWTResult(
        username,
        userinfo.Role,
        userinfo.DataBaseName
      );
      const result = await storeDataInRedisServer(jwtResult);
      return jwtResult;
    } else {
      const school = await user.findOne({
        UserName: { $in: userinfo.organization },
      });
      if (school) {
        const jwtResult = await getJWTResult(
          username,
          userinfo.Role,
          school.DataBaseName,
          userinfo.organization
        );
        const result = await storeDataInRedisServer(jwtResult);
        return jwtResult;
      } else {
        throw new Error("Organization not found");
      }
    }
  } else {
    throw new Error("Authentication failed");
  }
};
