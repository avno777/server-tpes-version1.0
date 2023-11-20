const userService = require("../services/user.service");

export const registerUser = async (req, res) => {
  try {
    await userService.registerUser(req.body);
    res.status(201).send("Registration successful.");
  } catch (error) {
    if (
      error.message === "UserName already exists." ||
      error.message.startsWith("Database") ||
      error.message === "Invalid role provided."
    ) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Error registering user.");
    }
  }
};
