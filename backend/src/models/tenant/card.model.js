import mongoose from "mongoose";

function createCardModel(connection) {
  const AccessSchema = mongoose.Schema({
    elevators: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "elevators",
      required: true,
    },
    separateFl1: {
      type: String,
    },
    separateFl3: {
      type: String,
    },
    separateFl3: {
      type: String,
    },
    separateFl4: {
      type: String,
    },
  });

  const CardSchema = new mongoose.Schema(
    {
      CardCode: {
        type: String,
        required: true,
      },
      PrintMarketCode: {
        type: String,
        required: true,
      },
      OwnerName: {
        type: String,
        required: true,
      },
      OwnerAddress: {
        type: String,
        required: true,
      },
      CreateDate: {
        type: String,
      },
      ExpireDate: {
        type: String,
      },
      Enable: {
        type: String,
      },
      Access: [AccessSchema],
      Status: {
        type: String,
      },
      Note: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );
  return connection.model("cards", CardSchema);
}

export default createCardModel;
