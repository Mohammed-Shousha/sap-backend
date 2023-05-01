import { ObjectId } from "mongodb";
import { joinPipeline } from "../utils/join.mjs";

export const allPrescriptions = async (prescriptions) => {
  const data = await prescriptions.find().toArray();
  return data;
};

export const prescriptionById = async (args, prescriptions) => {
  const { id } = args;

  const data = await prescriptions
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      ...joinPipeline,
    ])
    .toArray();

  return data[0];
};

export const prescriptionsByUser = async (args, prescriptions) => {
  const { userId } = args;

  const data = await prescriptions
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
    ])
    .toArray();

  return data;
};
