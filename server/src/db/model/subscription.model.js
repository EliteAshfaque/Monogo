const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
  plan: { type: String, enum: ["free", "premium"], default: "free" },
  status: { type: String, enum: ["active", "cancelled", "past_due"], default: "active" },
  paymentProvider: { type: String, default: "demo" },
  paymentReference: { type: String, default: "" },
  stripeCustomerId: { type: String, default: "" },
  stripeSubscriptionId: { type: String, default: "" },
  currentPeriodStart: { type: Date, default: Date.now },
  currentPeriodEnd: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("subscription", subscriptionSchema);
