import { connectionManager } from "../../config/multipleTenantDbConnection.js";
import { jwtVerify } from "../../middlewares/jwt.middleware.js";

// export const getCardModel = (req) => {
//   return global.DBConnectionsList[jwtVerify(req)].cardModel;
// };

export const getCardModel = (req) => {
  const dbName = jwtVerify(req);

  // Use the connectionManager to fetch the appropriate tenant-specific connection and models
  const tenantData = connectionManager.getConnection(dbName);

  if (!tenantData || !tenantData.models || !tenantData.models.cardModel) {
    throw new Error("Card model not found for the tenant.");
  }

  return tenantData.models.cardModel;
};

export const createCard = (Card, cardData) => {
  return new Promise((resolve, reject) => {
    Card.create(cardData, (err, success) => {
      if (err) reject(err);
      resolve(success);
    });
  });
};

export const getAllCards = (Card, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    Card.find()
      .skip(skip)
      .limit(limit)
      .exec((err, cards) => {
        if (err) {
          reject(err);
          return;
        }
        Card.countDocuments({}, (countErr, count) => {
          if (countErr) {
            reject(countErr);
            return;
          }
          resolve({
            total: count,
            cards: cards,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
          });
        });
      });
  });
};

export const findCardById = (Card, cardId) => {
  return new Promise((resolve, reject) => {
    Card.findById(cardId, (err, card) => {
      if (err) reject(err);
      resolve(card);
    });
  });
};

export const updateExistingCard = (Card, cardId, updatedData) => {
  return new Promise((resolve, reject) => {
    Card.findByIdAndUpdate(
      cardId,
      updatedData,
      { new: true },
      (err, updatedCard) => {
        if (err) reject(err);
        resolve(updatedCard);
      }
    );
  });
};

export const deleteCard = (Card, cardId) => {
  return new Promise((resolve, reject) => {
    Card.findByIdAndDelete(cardId, (err, deletedCard) => {
      if (err) reject(err);
      resolve(deletedCard);
    });
  });
};
