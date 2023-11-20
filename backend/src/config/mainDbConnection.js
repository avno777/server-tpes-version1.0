import mongoose from "mongoose";
import { config } from "dotenv";
config();

const mainDbUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_MAIN}`;

const clientOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const mainDBConnection = () => {
  mongoose.connect(mainDbUri, clientOption);

  mongoose.connection.on("error", (err) => {
    console.log(
      `Error connecting ${process.env.MONGODB_MAIN} database:- ` + err
    );
  });
  mongoose.connection.once("open", () => {
    console.log(`Connected to ${process.env.MONGODB_MAIN} database`);
  });
  mongoose.connection.on("disconnected", () => {
    console.log(`${process.env.MONGODB_MAIN} database is disconnected.`);
  });

  mongoose.connection.on("error", console.log);
};

export default mainDBConnection;
