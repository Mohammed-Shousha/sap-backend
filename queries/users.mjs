import { ObjectId } from 'mongodb'

export const userById = async (args, users) => {
   const { id } = args
   const data = await users.findOne({ _id: new ObjectId(id) })
   return data
}

export const allUsers = async (users) => {
   const data = await users.find({}).toArray()
   return data
}

export const allDoctors = async () => {
   const data = await users.find({ isDoctor: true }).toArray()
   return data
}