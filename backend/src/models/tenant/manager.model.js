import mongoose from "mongoose";

function createManagerModel(connection) {
  const ManagerSchema = new mongoose.Schema(
    {
      Name: {
        type: String,
        required: true,
      },
      Email: {
        type: String,
        required: true,
      },
      Password: {
        type: String,
        required: true,
      },
      Note: {
        type: String,
      },
    },
    { timestamps: true }
  );
  return connection.model("manager", ManagerSchema);
}

export default createManagerModel;
