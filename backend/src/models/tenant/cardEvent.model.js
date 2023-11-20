import mongoose from "mongoose";

function createCardEventModel(connection) {
  const CardEventSchema = new mongoose.Schema(
    {
      Cards: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "cards",
      },
      Elevators: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "elevators",
      },
      EventDate: {
        type: String,
        required: true,
      },
      Status: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );
  return connection.model("cardEvents", CardEventSchema);
}

export default createCardEventModel;
