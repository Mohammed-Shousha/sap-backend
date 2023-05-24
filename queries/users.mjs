import { ObjectId } from "mongodb";
import { checkObjectId } from "../utils/checkUtils.mjs";

export const allUsers = async (users) => {
  const usersResult = await users.find().toArray();
  return usersResult;
};

export const allDoctors = async (users) => {
  const doctors = await users.find({ isDoctor: true }).toArray();
  return doctors;
};

export const userById = async (args, users) => {
  const { id } = args;

  if (!checkObjectId(id)) {
    throw new Error("Invalid user id");
  }

  const user = await users.findOne({ _id: new ObjectId(id) });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
