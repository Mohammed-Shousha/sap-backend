export const joinPipeline = [{
   $lookup: {
      from: 'users',
      localField: 'doctorId',
      foreignField: '_id',
      as: 'doctor'
   }
},
{
   $lookup: {
      from: 'users',
      localField: 'patientId',
      foreignField: '_id',
      as: 'patient'
   }
},
{
   $unwind: '$doctor'
},
{
   $unwind: '$patient'
},
{
   $addFields: {
      doctorName: '$doctor.name',
      patientName: '$patient.name',
   }
},
{
   $project: {
      doctor: 0,
      patient: 0
   }
}]