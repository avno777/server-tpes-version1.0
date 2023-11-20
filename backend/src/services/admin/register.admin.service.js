import { createDB } from "../../helpers/createDB.helper";
import { hashPassword } from "../../helpers/password.helper";

const User = require("../models/user.model");

export const registerUser = async (userData) => {
  const { UserName, Password, Role, Level1UserName, DataBaseName } = userData;

  const existingUser = await User.findOne({ UserName });
  if (existingUser) {
    throw new Error("UserName already exists.");
  }

  const hashedPassword = await hashPassword(Password);

  let newUser;
  if (Role === "Level1") {
    newUser = new User({
      UserName,
      Password: hashedPassword,
      Role: "Level1",
      DataBaseName: null,
      createdUsers: [],
    });
  } else if (Role === "Level2") {
    await createDB(DataBaseName, (exists) => {
      if (exists) {
        throw new Error(`Database ${DataBaseName} already exists.`);
      }
    });
    newUser = new User({
      UserName,
      Password: hashedPassword,
      Role: "Level2",
      DataBaseName,
      createdUsers: [],
    });

    await User.updateOne(
      { UserName: Level1UserName },
      { $push: { createdUsers: UserName } }
    );
  } else {
    throw new Error("Invalid role provided.");
  }

  return await newUser.save();
};
