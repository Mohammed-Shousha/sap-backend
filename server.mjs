import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { registerUser, login, registerDoctor } from './mutations/users.mjs'
import { addPrescription } from './mutations/prescriptions.mjs'

dotenv.config()

const app = express()
const { MONGO_URI, PORT } = process.env

const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })

const db = client.db('SAP')
const medicines = db.collection('medicines')
const users = db.collection('users')
const prescriptions = db.collection('prescriptions')

const typeDefs = `#graphql

   type Medicine {
      _id: ID!
      name: String!
      otc: Boolean! #over-the-counter 
      price: Float!
      description: String!
      position: Coord!
      availableQuantity: Int!
   }

   type Coord {
      row: Int!
      col: Int!
   }

   type User {
      _id: ID!
      name: String!
      email: String!
      password: String!
      doctor: Boolean!
      prescriptions: [Prescription!]
   }

   type PrescriptionMedicine {
      medicineId: ID!
      quantity: Int!
      doctorInstructions: String!
   }

   input PrescriptionMedicineInput {
      medicineId: ID!
      quantity: Int!
      doctorInstructions: String!
   }
      
   type Prescription {
      _id: ID!
      patientId: ID!
      doctorId: ID!
      medicines: [PrescriptionMedicine!]
      date: String!
      purchased: Boolean!
   }

   type Query {
      medicines: [Medicine!]
      users: [User!]
      prescriptions: [Prescription!]
   }

   type Mutation {
      resisterUser(name: String!, email: String!, password: String!): User!
      registerDoctor(name: String!, email: String!, password: String!, licenseNumber: String!): User!
      login(email: String!, password: String!): User!
      addPrescription(patientId: ID!, doctorId: ID!, medicines: [PrescriptionMedicineInput!]!): Prescription!

      deleteUsers: Boolean!
      deletePrescriptions: Boolean!
   }
   
   `

const resolvers = {
   Query: {
      medicines: async () => {
         const data = await medicines.find().toArray()
         return data
      },
      users: async () => {
         const data = await users.find().toArray()
         return data
      },
      prescriptions: async () => {
         const data = await prescriptions.find().toArray()
         return data
      }
   },
   Mutation: {
      resisterUser: (_, args) => registerUser(args, users),
      login: (_, args) => login(args, users),
      registerDoctor: (_, args) => registerDoctor(args, users),
      addPrescription: (_, args) => addPrescription(args, prescriptions),
      deleteUsers: async () => {
         await users.deleteMany({})
         return true
      },
      deletePrescriptions: async () => {
         await prescriptions.deleteMany({})
         return true
      }
   },
}

const port = PORT || 4040

const server = new ApolloServer({
   typeDefs,
   resolvers,
   // cors: false,
})

await server.start()

// app.use(cors({
//    origin: 'http://localhost:3000',
//    credentials: true
// }))

app.use(
   '/graphql',
   cors(),
   bodyParser.json(),
   expressMiddleware(server)
)


app.listen({ port }, () =>
   console.log(`Now browse to http://localhost:${port}/graphql`)
)
