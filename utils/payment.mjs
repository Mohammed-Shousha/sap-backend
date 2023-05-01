import { ObjectId } from "mongodb";

export const createPaymentIntent = async (req, res, Stripe) => {
  const { amount } = req.body;

  const paymentIntent = await Stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "egp",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
  });
};

export const markPrescriptionAsPaid = async (req, res, prescriptions) => {
  const { prescriptionId } = req.body;

  await prescriptions.findOneAndUpdate(
    { _id: new ObjectId(prescriptionId) },
    { $set: { isPaid: true } },
    { returnDocument: "after" }
  );

  return res.status(200).send("ok");
};
