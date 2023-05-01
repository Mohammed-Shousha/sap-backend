import { ObjectId } from "mongodb";

export const allMedicines = async (medicines) => {
  const data = await medicines.find().toArray();
  return data;
};

export const otcMedicines = async (medicines) => {
  const data = await medicines.find({ otc: true }).toArray();
  return data;
};

export const medicineById = async (args, medicines) => {
  const { id } = args;

  const data = await medicines.findOne({
    _id: new ObjectId(id),
    availableQuantity: { $gte: 1 },
  });

  return data;
};
