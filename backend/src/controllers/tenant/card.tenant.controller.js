import {
  getCardModel,
  createCard,
  getAllCards,
  updateExistingCard,
  deleteCard,
} from "../../services/tenant/card.tenant.service";

export const CreateCard = async (req, res, next) => {
  const Card = getCardModel(req);
  try {
    const success = await createCard(Card, req.body);
    if (success) {
      return res.status(200).send(success);
    } else {
      return res.status(404).send("Card is not created.");
    }
  } catch (err) {
    return res.status(402).send(err);
  }
};

export const getAllCards = async (req, res, next) => {
  const Card = getCardModel(req);
  try {
    const result = await getAllCards(Card, req.query);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(402).send(err);
  }
};

export const getCard = async (req, res, next) => {
  const Card = getCardModel(req);
  const cardId = req.params.id;

  try {
    const result = await findSchoolById(Card, cardId);
    if (result) {
      return res.status(200).send(result);
    } else {
      return res.status(404).send("Card is not found.");
    }
  } catch (err) {
    return res.status(402).send(err);
  }
};

export const updateCard = async (req, res, next) => {
  const Card = getCardModel(req);
  const cardId = req.params.id;

  try {
    const result = await updateExistingCard(Card, cardId, req.body);
    if (result) {
      return res.status(200).send(result);
    } else {
      return res.status(404).send("Card is not found.");
    }
  } catch (err) {
    return res.status(402).send(err);
  }
};

export const deleteCard = async (req, res, next) => {
  const Card = getCardModel(req);
  const cardId = req.params.id;

  try {
    const result = await deleteCard(Card, cardId);
    if (result) {
      return res.status(200).send(result);
    } else {
      return res.status(404).send("Card is not found.");
    }
  } catch (error) {}
};
