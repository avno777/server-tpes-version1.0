import { jwtVerify } from "../../middlewares/jwt.middleware.js";

export const getUserModel = (req) => {
  const dbName = jwtVerify(req);

  // Use the connectionManager to fetch the appropriate tenant-specific connection and models
  const tenantData = connectionManager.getConnection(dbName);

  if (!tenantData || !tenantData.models || !tenantData.models.elevatorModel) {
    throw new Error("Card model not found for the tenant.");
  }

  return tenantData.models.elevatorModel;
};

export const createUserEvent = (User, userData) => {
  return new Promise((resolve, reject) => {
    User.create(userData, (err, success) => {
      if (err) reject(err);
      resolve(success);
    });
  });
};

export const getAllUsers = (User, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    User.find()
      .skip(skip)
      .limit(limit)
      .exec((err, users) => {
        if (err) {
          reject(err);
          return;
        }
        User.countDocuments({}, (countErr, count) => {
          if (countErr) {
            reject(countErr);
            return;
          }
          resolve({
            total: count,
            users: users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
          });
        });
      });
  });
};

export const findUserById = (User, userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) reject(err);
      resolve(user);
    });
  });
};

export const updateExistingCard = (User, userId, updatedData) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true },
      (err, updatedUser) => {
        if (err) reject(err);
        resolve(updatedUser);
      }
    );
  });
};
