import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    TenantName: {
      type: String,
      required: true,
    },
    ProjectName: {
      type: String,
      required: true,
    },
    DatabaseName: {
      type: String,
      unique: true,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
    },
    CreateBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "customers",
    },
    Boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "board",
      },
    ],
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("projects", ProjectSchema);
export default ProjectModel;
