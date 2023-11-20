// modelsLoader.js

import createCardModel from "../models/tenant/card.model";
import createCardEventModel from "../models/tenant/cardEvent.model";
import createElevatorModel from "../models/tenant/elevator.model";
import createManagerModel from "../models/tenant/manager.model";
import createUserModel from "../models/tenant/user.model";

export function loadTenantModels(connection) {
  return {
    cardModel: createCardModel(connection),
    cardEventModel: createCardEventModel(connection),
    elevatorModel: createElevatorModel(connection),
    managerModel: createManagerModel(connection),
    userModel: createUserModel(connection),
  };
}
