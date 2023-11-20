import {
  createClient,
  createUser,
  userLogin,
} from "../../services/admin/user.admin.service";

export const clientCreationController = async (req, res, next) => {
  try {
    const application = req.body;
    if (application) {
      const newUser = await createClient(application);
      res.status(200).send(newUser);
    } else {
      res.status(400).send("Data not provided.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const userCreationController = async (req, res, next) => {
  try {
    const application = req.body;
    if (application) {
      const newUser = await createUser(application);
      res.status(200).send(newUser);
    } else {
      res.status(400).send("Data not provided.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const userLoginController = async (req, res, next) => {
  try {
    const username = req.body.UserName;
    const password = req.body.Password;
    const jwtResult = await userLogin(username, password);
    res.status(200).send(jwtResult);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

import {
  createClientService,
  createUser,
  loginUser,
  updateUser,
  retrieveAllUsers,
  retrieveUser,
} from "./userService.mjs";

// ... other controller functions ...

export const updateUserController = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const updatedUser = await updateUser(userId, data);
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await retrieveAllUsers();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getUserController = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userDetail = await retrieveUser(userId);
    res.status(200).send(userDetail);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
