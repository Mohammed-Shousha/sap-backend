import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const { MONGO_URI, PORT } = process.env

const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })

const db = client.db('SAP')
const medicines = db.collection('medicines')
const users = db.collection('users')

const typeDefs = `#graphql

   type Medicine {
      _id: ID!
      name: String!
      otc: Boolean!
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
      
   type Prescription {
      _id: ID!
      patientId: ID!
      doctorId: ID!
      medicines: [PrescriptionMedicine!]
      date: String!
   }

   type Query {
      medicines: [Medicine!]
      users: [User!]

   }

   type Mutation {
      resisterUser(name: String!, email: String!, password: String!, doctor: Boolean!): User!
      login(email: String!, password: String!): User!
      deleteUsers: Boolean!
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
      }
   },
   Mutation: {
      resisterUser: async (_, { name, email, password, doctor }) => {
         const data = await users.insertOne({ name, email, password, doctor, prescriptions: [] })
         const user = await users.findOne({ _id: data.insertedId })
         return user
      },
      login: async (_, { email, password }) => {
         const data = await users.findOne({ email, password })
         return data
      },
      deleteUsers: async () => {
         await users.deleteMany({})
         return true
      }
   }
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
   console.log(`Now browse to http://localhost:${port}`)
)
