const User = require("../db/model/user.model");
const Subscription = require("../db/model/subscription.model");
const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;
const PLANS = {
  free: { id: "free", name: "Free", price: 0, features: ["Ad-supported listening", "Limited skips", "Standard quality"] },
  premium: { id: "premium", name: "Premium", price: 9.99, features: ["Ad-free music", "Premium-only releases", "Unlimited skips", "High quality audio"] },
};
exports.plans = (_req, res) => res.json({ plans: Object.values(PLANS) });
exports.subscribe = async (req, res) => {
  const { plan, paymentMethodId } = req.body;
  if (!PLANS[plan]) return res.status(400).json({ message: "Choose a valid plan" });
  if (plan === "premium" && !paymentMethodId) return res.status(400).json({ message: "Payment details are required" });
  const now = new Date();
  const currentPeriodEnd = plan === "premium" ? new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()) : undefined;
  const subscription = await Subscription.findOneAndUpdate(
    { user: req.user._id },
    { plan, status: "active", paymentProvider: plan === "premium" ? "demo" : "", paymentReference: plan === "premium" ? paymentMethodId : "", currentPeriodStart: now, currentPeriodEnd },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const user = await User.findByIdAndUpdate(req.user._id, { plan }, { new: true });
  res.json({ message: plan === "premium" ? "Premium is now active" : "Free plan selected", subscription, user: { id: user._id, username: user.username, plan: user.plan, role: user.role } });
};

exports.createCheckoutSession = async (req, res) => {
  if (!stripe) return res.status(503).json({ message: "Stripe payments are not configured" });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: req.user.email,
    line_items: [process.env.STRIPE_PRICE_PREMIUM_MONTHLY ? { price: process.env.STRIPE_PRICE_PREMIUM_MONTHLY, quantity: 1 } : { price_data: { currency: "usd", product_data: { name: "Sonora Premium" }, unit_amount: 999, recurring: { interval: "month" } }, quantity: 1 }],
    metadata: { userId: req.user._id.toString() },
    subscription_data: { metadata: { userId: req.user._id.toString() } },
    success_url: `${process.env.CLIENT_URL}/?checkout=success`,
    cancel_url: `${process.env.CLIENT_URL}/?checkout=cancelled`,
  });
  res.json({ url: session.url });
};

exports.stripeWebhook = async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).send("Stripe webhook is not configured");
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET); } catch (error) { return res.status(400).send(`Webhook signature verification failed: ${error.message}`); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object; const userId = session.metadata?.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { plan: "premium" });
      await Subscription.findOneAndUpdate({ user: userId }, { user: userId, plan: "premium", status: "active", paymentProvider: "stripe", paymentReference: session.id, stripeCustomerId: String(session.customer || ""), stripeSubscriptionId: String(session.subscription || "") }, { upsert: true, new: true });
    }
  }
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const record = await Subscription.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, { plan: "free", status: "cancelled" }, { new: true });
    if (record) await User.findByIdAndUpdate(record.user, { plan: "free" });
  }
  if (event.type === "invoice.payment_failed") await Subscription.findOneAndUpdate({ stripeSubscriptionId: String(event.data.object.subscription || "") }, { status: "past_due" });
  res.json({ received: true });
};
