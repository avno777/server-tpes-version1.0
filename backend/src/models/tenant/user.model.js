import mongoose from "mongoose";

function createUserModel(connection) {
  const TenantSchema = new mongoose.Schema(
    {
      phoneNumber: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      CreateBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  return connection.model("users", TenantSchema);
}

export default createUserModel;
