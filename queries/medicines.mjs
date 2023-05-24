import { ObjectId } from "mongodb";
import { checkObjectId } from "../utils/checkUtils.mjs";

export const allMedicines = async (medicines) => {
  const medicinesResult = await medicines.find().toArray();
  return medicinesResult;
};

export const otcMedicines = async (medicines) => {
  const otcMeds = await medicines.find({ otc: true }).toArray();
  return otcMeds;
};

export const medicineById = async (args, medicines) => {
  const { id } = args;

  if (!checkObjectId(id)) {
    throw new Error("Invalid medicine id");
  }

  const medicine = await medicines.findOne({ _id: new ObjectId(id) });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  return medicine;
};
