import bcrypt from "bcrypt";

export const registerUser = async (args, users) => {
  const { name, email, password } = args;

  const isUser = await users.findOne({
    email,
  });

  if (isUser) {
    throw new Error("User already exists");
  }

  const data = await users.insertOne({
    name,
    email,
    password: await encryptPassword(password),
    isDoctor: false,
  });

  const user = await users.findOne({
    _id: data.insertedId,
  });

  return user;
};

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

export const registerDoctor = async (args, users) => {
  const { name, email, password, licenseNumber } = args;

  const isUser = await users.findOne({
    email,
  });

  if (isUser) {
    throw new Error("User already exists");
  }

  const isLicenseNumberValid = checkLicenseNumber(licenseNumber, users);

  if (!isLicenseNumberValid) {
    throw new Error("Invalid license number");
  }

  const data = await users.insertOne({
    name,
    email,
    password: await encryptPassword(password),
    isDoctor: true,
  });

  const user = await users.findOne({
    _id: data.insertedId,
  });

  return user;
};

export const deleteUsers = async (users) => {
  await users.deleteMany({});
  return true;
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const checkPassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

const checkLicenseNumber = (licenseNumber) => {
  const sampleLincenseNumber = ["123456789", "987654321"];

  if (sampleLincenseNumber.includes(licenseNumber)) {
    return true;
  }
};
