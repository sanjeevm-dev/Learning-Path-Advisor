import mongoose from "mongoose";

export default {
  connect: async () => {
    try {
      await mongoose.connect(`${process.env.MONGO_URI}`);
      return mongoose.connection;
    } catch (err) {
      throw err;
    }
  },
};
