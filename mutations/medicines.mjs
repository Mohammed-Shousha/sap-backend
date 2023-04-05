import { ObjectId } from 'mongodb'

const dummyMedicines = [
   {
      "name": "Tylenol",
      "description": "Pain reliever and fever reducer",
      "price": 15.5,
      "otc": true,
      "position": {
         "row": 1,
         "col": 1
      },
      "availableQuantity": 100
   },
   {
      "name": "Advil",
      "description": "Pain reliever and fever reducer",
      "price": 18.0,
      "otc": true,
      "position": {
         "row": 2,
         "col": 1
      },
      "availableQuantity": 75
   },
   {
      "name": "Zyrtec",
      "description": "Antihistamine",
      "price": 27.5,
      "otc": false,
      "position": {
         "row": 3,
         "col": 2
      },
      "availableQuantity": 50
   },
   {
      "name": "Lipitor",
      "description": "Cholesterol-lowering medication",
      "price": 85.0,
      "otc": false,
      "position": {
         "row": 2,
         "col": 3
      },
      "availableQuantity": 25
   },
   {
      "name": "Metformin",
      "description": "Diabetes medication",
      "price": 12.5,
      "otc": false,
      "position": {
         "row": 4,
         "col": 1
      },
      "availableQuantity": 125
   },
   {
      "name": "Benadryl",
      "description": "Allergy relief medication",
      "price": 20.0,
      "otc": true,
      "position": {
         "row": 1,
         "col": 2
      },
      "availableQuantity": 60
   },
   {
      "name": "Mucinex",
      "description": "Expectorant",
      "price": 30.0,
      "otc": true,
      "position": {
         "row": 3,
         "col": 3
      },
      "availableQuantity": 40
   },
   {
      "name": "Zantac",
      "description": "Acid reducer",
      "price": 22.5,
      "otc": false,
      "position": {
         "row": 4,
         "col": 2
      },
      "availableQuantity": 30
   },
   {
      "name": "Ventolin",
      "description": "Asthma inhaler",
      "price": 40.0,
      "otc": false,
      "position": {
         "row": 5,
         "col": 1
      },
      "availableQuantity": 20
   },
   {
      "name": "Prozac",
      "description": "Antidepressant",
      "price": 60.0,
      "otc": false,
      "position": {
         "row": 5,
         "col": 2
      },
      "availableQuantity": 15
   }
]

export const addMedicines = async (medicines) => {
   await medicines.insertMany(medicines)
   return true
}

export const updateMedicine = async (args, medicines) => {
   const { id, orderedQuantity } = args

   const data = await medicines.findOne({
      _id: new ObjectId(id),
      availableQuantity: { $gte: orderedQuantity },  // Check if there is enough quantity
   })

   if (!data) {
      throw new Error('Not enough quantity')
   }

   const result = await medicines.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { availableQuantity: -orderedQuantity } },  // Decrement the quantity
      { returnDocument: 'after' },
   )

   return result.value

}

export const deleteMedicines = async (medicines) => {
   await medicines.deleteMany({})
   return true
}