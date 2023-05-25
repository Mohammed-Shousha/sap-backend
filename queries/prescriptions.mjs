import { ObjectId } from "mongodb";
import { joinPipeline } from "../utils/join.mjs";
import { checkObjectId } from "../utils/checkUtils.mjs";

export const allPrescriptions = async (prescriptions) => {
  const prescriptionsResult = await prescriptions
    .aggregate([...joinPipeline])
    .toArray();

  return prescriptionsResult;
};

export const prescriptionById = async (args, prescriptions) => {
  const { id } = args;

  if (!checkObjectId(id)) {
    throw new Error("Invalid prescription id");
  }

  const prescription = await prescriptions
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      ...joinPipeline,
    ])
    .toArray();

  return prescription[0];
};

export const prescriptionsByUser = async (args, prescriptions) => {
  const { userId } = args;

  if (!checkObjectId(userId)) {
    throw new Error("Invalid user id");
  }

  const userPrescriptions = await prescriptions
    .aggregate([
      {
        $match: {
          $or: [
            { patientId: new ObjectId(userId) },
            { doctorId: new ObjectId(userId) },
          ],
        },
      },
      ...joinPipeline,
      {
        $sort: {
          date: -1,
        },
      },
    ])
    .toArray();

  return userPrescriptions;
};
