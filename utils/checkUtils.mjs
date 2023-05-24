import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const checkPassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

export const checkLicenseNumber = (licenseNumber) => {
  const sampleLincenseNumber = ["123456789", "987654321"];

  if (sampleLincenseNumber.includes(licenseNumber)) {
    return true;
  }
};

export const checkObjectId = (id) => {
  return ObjectId.isValid(id);
};
