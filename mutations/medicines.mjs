import { ObjectId } from "mongodb";
import { checkObjectId } from "../utils/checkUtils.mjs";

export const addMedicines = async (args, medicines) => {
  const { medicinesArray } = args;

  const result = await medicines.insertMany(medicinesArray);

  if (!result.acknowledged) {
    throw new Error("Could not add medicines");
  }

  return true;
};

export const updateMedicine = async (args, medicines) => {
  const { id, addedQuantity } = args;

  if (!checkObjectId(id)) {
    throw new Error("Invalid medicine id");
  }

  const medicine = await medicines.findOne({ _id: new ObjectId(id) });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  const result = await medicines.updateOne(
    { _id: new ObjectId(id) },
    { $inc: { availableQuantity: addedQuantity } }
  );

  if (result.modifiedCount !== 1) {
    throw new Error("Medicine not updated");
  }

  return true;
};

export const deleteMedicines = async (medicines) => {
  const result = await medicines.deleteMany();

  if (!result.acknowledged) {
    throw new Error("Could not delete medicines");
  }

  return true;
};
