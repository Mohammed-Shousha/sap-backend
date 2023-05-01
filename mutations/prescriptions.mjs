import { ObjectId } from "mongodb";
import { joinPipeline } from "../utils/join.mjs";

export const addPrescription = async (args, prescriptions) => {
  const { patientId, doctorId, medicines } = args;

  const data = await prescriptions.insertOne({
    patientId: new ObjectId(patientId),
    doctorId: new ObjectId(doctorId),
    medicines,
    date: new Date(),
    isPaid: false,
    isRecived: false,
  });

  const prescription = await prescriptions
    .aggregate([
      {
        $match: {
          _id: data.insertedId,
        },
      },
      ...joinPipeline,
    ])
    .toArray();

  return prescription[0];
};

//TODO: calclate prescription total price
// using medicines price and quantity

export const deletePrescriptions = async (prescriptions) => {
  await prescriptions.deleteMany({});
  return true;
};
