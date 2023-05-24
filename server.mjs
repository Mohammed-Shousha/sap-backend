import express from "express";
import cors from "cors";
import stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import {
  registerUser,
  login,
  registerDoctor,
  deleteUsers,
} from "./mutations/users.mjs";
import {
  addPrescription,
  deletePrescriptions,
} from "./mutations/prescriptions.mjs";
import {
  allPrescriptions,
  prescriptionById,
  prescriptionsByUser,
} from "./queries/prescriptions.mjs";
import { allDoctors, allUsers, userById } from "./queries/users.mjs";
import {
  allMedicines,
  otcMedicines,
  medicineById,
} from "./queries/medicines.mjs";
import {
  addMedicines,
  updateMedicine,
  deleteMedicines,
} from "./mutations/medicines.mjs";
import {
  createPaymentIntent,
  markPrescriptionAsPaid,
} from "./utils/payment.mjs";

dotenv.config();

const app = express();
const { MONGO_URI, PORT, STRIPE_SECRET_KEY } = process.env;

const Stripe = stripe(STRIPE_SECRET_KEY);

const client = await MongoClient.connect(MONGO_URI, {
  useUnifiedTopology: true,
});

const db = client.db("SAP");
const medicines = db.collection("medicines");
const users = db.collection("users");
const prescriptions = db.collection("prescriptions");

const typeDefs = `#graphql

   scalar Date

   type Medicine {
      _id: ID!
      name: String!
      otc: Boolean! #over-the-counter 
      price: Float!
      description: String!
      position: Coord!
      availableQuantity: Int!
   }

   input MedicineInput {
      name: String!
      otc: Boolean! #over-the-counter 
      price: Float!
      description: String!
      position: CoordInput!
      availableQuantity: Int!
   }

   type Coord {
      row: Int!
      col: Int!
   }

   input CoordInput {
      row: Int!
      col: Int!
   }

   type User {
      _id: ID!
      name: String!
      email: String!
      password: String!
      isDoctor: Boolean!
   }

   type PrescriptionMedicine {
      medicineId: ID!
      medicineName: String!
      quantity: Int!
      price: Float!
      doctorInstructions: String
   }

   input PrescriptionMedicineInput {
      medicineId: ID!
      medicineName: String!
      quantity: Int!
      price: Float!
      doctorInstructions: String
   }
      
   type Prescription {
      _id: ID!
      patientId: ID!
      patientName: String!
      doctorId: ID!
      doctorName: String!
      medicines: [PrescriptionMedicine!]
      date: Date!
      isPaid: Boolean!
      isReceived: Boolean!
   }

   type Query {
      medicines: [Medicine!]
      otcMedicines: [Medicine!]
      medicineById(id: ID!): Medicine!
      users: [User!]
      doctors: [User!]
      user(id: ID!): User!
      prescriptions: [Prescription!]
      prescriptionById(id: ID!): Prescription!
      prescriptionsByUser(userId: ID!): [Prescription!]
   }

   type Mutation {
      registerUser(name: String!, email: String!, password: String!): User!
      registerDoctor(name: String!, email: String!, password: String!, licenseNumber: String!): User!
      login(email: String!, password: String!): User!
      addPrescription(patientId: ID!, doctorId: ID!, medicines: [PrescriptionMedicineInput!]!): Boolean!
      deleteUsers: Boolean!
      deletePrescriptions: Boolean!
      addMedicines(medicinesArray: [MedicineInput!]): Boolean!
      updateMedicine(id: ID!, addedQuantity: Int!): Boolean!
      deleteMedicines: Boolean!
   }
   
   `;

const resolvers = {
  Query: {
    user: (_, args) => userById(args, users),
    users: () => allUsers(users),
    doctors: () => allDoctors(users),
    prescriptions: () => allPrescriptions(prescriptions),
    prescriptionById: (_, args) => prescriptionById(args, prescriptions),
    prescriptionsByUser: (_, args) => prescriptionsByUser(args, prescriptions),
    medicines: () => allMedicines(medicines),
    otcMedicines: () => otcMedicines(medicines),
    medicineById: (_, args) => medicineById(args, medicines),
  },
  Mutation: {
    login: (_, args) => login(args, users),
    registerUser: (_, args) => registerUser(args, users),
    registerDoctor: (_, args) => registerDoctor(args, users),
    deleteUsers: () => deleteUsers(users),
    addPrescription: (_, args) => addPrescription(args, prescriptions, users),
    deletePrescriptions: () => deletePrescriptions(prescriptions),
    addMedicines: (_, args) => addMedicines(args, medicines),
    updateMedicine: (_, args) => updateMedicine(args, medicines),
    deleteMedicines: () => deleteMedicines(medicines),
  },
};

const port = PORT || 4040;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // cors: false,
});
await server.start();

app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

app.use(express.json());

app.post("/payment-sheet", (req, res) => createPaymentIntent(req, res, Stripe));

app.put("/mark-prescription-paid", (req, res) =>
  markPrescriptionAsPaid(req, res, prescriptions)
);

app.listen({ port }, () =>
  console.log(`Now browse to http://localhost:${port}/graphql`)
);
