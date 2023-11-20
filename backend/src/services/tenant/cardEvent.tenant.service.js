import { connectionManager } from "../../config/multipleTenantDbConnection.js";
import { jwtVerify } from "../../middlewares/jwt.middleware.js";

// export const getCardEventModel = (req) => {
//   return global.DBConnectionsList[jwtVerify(req)].cardEventModel;
// };

export const getCardEventModel = (req) => {
  const dbName = jwtVerify(req);

  // Use the connectionManager to fetch the appropriate tenant-specific connection and models
  const tenantData = connectionManager.getConnection(dbName);

  if (!tenantData || !tenantData.models || !tenantData.models.cardEventModel) {
    throw new Error("Card model not found for the tenant.");
  }

  return tenantData.models.cardEventModel;
};

export const createCardEvent = (CardEvent, cardEventData) => {
  return new Promise((resolve, reject) => {
    CardEvent.create(cardEventData, (err, success) => {
      if (err) reject(err);
      resolve(success);
    });
  });
};

export const getAllCardEvents = (CardEvent, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    CardEvent.find()
      .skip(skip)
      .limit(limit)
      .exec((err, cardEvents) => {
        if (err) {
          reject(err);
          return;
        }
        CardEvent.countDocuments({}, (countErr, count) => {
          if (countErr) {
            reject(countErr);
            return;
          }
          resolve({
            total: count,
            cardEvents: cardEvents,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
          });
        });
      });
  });
};

export const findCardById = (CardEvent, cardEventId) => {
  return new Promise((resolve, reject) => {
    CardEvent.findById(cardEventId, (err, cardEvent) => {
      if (err) reject(err);
      resolve(cardEvent);
    });
  });
};

export const updateExistingCard = (CardEvent, cardEventId, updatedData) => {
  return new Promise((resolve, reject) => {
    CardEvent.findByIdAndUpdate(
      cardEventId,
      updatedData,
      { new: true },
      (err, updatedCardEvent) => {
        if (err) reject(err);
        resolve(updatedCardEvent);
      }
    );
  });
};
