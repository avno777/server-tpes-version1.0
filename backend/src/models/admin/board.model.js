import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema(
  {
    BoardName: {
      type: String,
      required: true,
    },
    Building: {
      type: String,
      required: true,
    },
    Elevator: {
      type: String,
      required: true,
    },
    Enable: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BoardModel = mongoose.model("boards", BoardSchema);
export default BoardModel;
