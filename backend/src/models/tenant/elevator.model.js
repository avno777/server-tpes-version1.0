import mongoose from "mongoose";

function createElevatorModel(connection) {
  const ElevatorSchema = new mongoose.Schema(
    {
      ElevatorName: {
        type: String,
        required: true,
      },
      BoardName: {
        type: String,
        required: true,
      },
      BoardIpAddress: {
        type: String,
        required: true,
      },
      Building: {
        type: String,
      },
      ByPass1: {
        type: String,
      },
      ByPass2: {
        type: String,
      },
      ByPass3: {
        type: String,
      },
      ByPass4: {
        type: String,
      },
      Note: {
        type: String,
      },
    },
    { timestamps: true }
  );
  return connection.model("elevators", ElevatorSchema);
}

export default createElevatorModel;
