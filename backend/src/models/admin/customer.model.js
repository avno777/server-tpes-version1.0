import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Tel: {
      type: String,
    },
    Password: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CustomerModel = mongoose.model("customers", CustomerSchema);

export default CustomerModel;
