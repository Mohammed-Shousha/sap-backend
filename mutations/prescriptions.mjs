export const addPrescription = async (args, prescriptions) => {
   const { patientId, doctorId, medicines } = args

   const data = await prescriptions.insertOne({
      patientId,
      doctorId,
      medicines,
      date: new Date(),
      purchased: false,
   })

   const prescription = await prescriptions.findOne({
      _id: data.insertedId,
   })

   return prescription
}