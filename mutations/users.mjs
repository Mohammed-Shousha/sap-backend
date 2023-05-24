import {
  encryptPassword,
  checkPassword,
  checkLicenseNumber,
} from "../utils/checkUtils.mjs";

export const login = async (args, users) => {
  const { email, password } = args;

  const user = await users.findOne({
    email,
  });

  if (!user) {
    throw new Error("User does not exist");
  }

  const match = await checkPassword(password, user.password);

  if (!match) {
    throw new Error("Wrong password");
  }

  return user;
};

export const registerUser = async (args, users) => {
  const { name, email, password } = args;

  const isUser = await users.findOne({ email });

  if (isUser) {
    throw new Error("User already exists");
  }

  const data = await users.insertOne({
    name,
    email,
    password: await encryptPassword(password),
    isDoctor: false,
  });

  const user = await users.findOne({ _id: data.insertedId });

  if (!user) {
    throw new Error("Could not create user");
  }

  return user;
};

export const registerDoctor = async (args, users) => {
  const { name, email, password, licenseNumber } = args;

  const isUser = await users.findOne({
    email,
  });

  if (isUser) {
    throw new Error("User already exists");
  }

  if (!checkLicenseNumber(licenseNumber, users)) {
    throw new Error("Invalid license number");
  }

  const data = await users.insertOne({
    name,
    email,
    password: await encryptPassword(password),
    isDoctor: true,
  });

  const user = await users.findOne({ _id: data.insertedId });

  return user;
};

export const deleteUsers = async (users) => {
  const result = await users.deleteMany();

  if (!result.acknowledged) {
    throw new Error("Could not delete users");
  }

  return true;
};
