import { ObjectId } from "mongodb";
import { checkObjectId } from "../utils/checkUtils.mjs";

export const addPrescription = async (args, prescriptions, users) => {
  const { patientId, doctorId, medicines } = args;

  if (!checkObjectId(patientId) || !checkObjectId(doctorId)) {
    throw new Error("Invalid user id");
  }

  const ids = [new ObjectId(patientId), new ObjectId(doctorId)];

  const matchedUsers = await users.find({ _id: { $in: ids } }).toArray();

  if (matchedUsers.length !== 2) {
    throw new Error("User not found");
  }

  const insertedPrescription = await prescriptions.insertOne({
    patientId: new ObjectId(patientId),
    doctorId: new ObjectId(doctorId),
    medicines,
    date: new Date(),
    isPaid: false,
    isReceived: false,
  });

  if (!insertedPrescription.acknowledged) {
    throw new Error("Could not add prescription");
  }

  return true;
};

export const deletePrescriptions = async (prescriptions) => {
  const result = await prescriptions.deleteMany();

  if (!result.acknowledged) {
    throw new Error("Could not delete prescriptions");
  }

  return true;
};
