import { connectionManager } from "../../config/multipleTenantDbConnection.js";
import { jwtVerify } from "../../middlewares/jwt.middleware.js";

// export const getElevatorModel = (req) => {
//   return global.DBConnectionsList[jwtVerify(req)].elevatorModel;
// };

export const getElevatorModel = (req) => {
  const dbName = jwtVerify(req);

  // Use the connectionManager to fetch the appropriate tenant-specific connection and models
  const tenantData = connectionManager.getConnection(dbName);

  if (!tenantData || !tenantData.models || !tenantData.models.elevatorModel) {
    throw new Error("Card model not found for the tenant.");
  }

  return tenantData.models.elevatorModel;
};

export const createElevator = (Elevator, elevatorData) => {
  return new Promise((resolve, reject) => {
    Elevator.create(elevatorData, (err, success) => {
      if (err) reject(err);
      resolve(success);
    });
  });
};

export const getAllElevators = (Elevator, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    Elevator.find()
      .skip(skip)
      .limit(limit)
      .exec((err, elevators) => {
        if (err) {
          reject(err);
          return;
        }
        Elevator.countDocuments({}, (countErr, count) => {
          if (countErr) {
            reject(countErr);
            return;
          }
          resolve({
            total: count,
            elevators: elevators,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
          });
        });
      });
  });
};

export const findCardById = (Elevator, elevatorId) => {
  return new Promise((resolve, reject) => {
    Elevator.findById(elevatorId, (err, elevator) => {
      if (err) reject(err);
      resolve(elevator);
    });
  });
};

export const updateExistingCard = (Elevator, elevatorId, updatedData) => {
  return new Promise((resolve, reject) => {
    Elevator.findByIdAndUpdate(
      elevatorId,
      updatedData,
      { new: true },
      (err, updatedElevator) => {
        if (err) reject(err);
        resolve(updatedElevator);
      }
    );
  });
};
