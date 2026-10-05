// TODO: Move these business rules to the database once the admin business settings page exists.
// COD_MAX_AMOUNT must be kept in sync with client/src/config/orderRules.ts until then.

// Cash on delivery is limited to this order total (LKR); larger orders must be paid by card.
// Applies to new and returning customers alike.
const COD_MAX_AMOUNT = 5000;

// A card order is saved before the customer pays. If the Stripe page is abandoned, the unpaid order
// is cancelled once the payment link has expired. Stripe's minimum session lifetime is 30 minutes,
// so the order is only treated as abandoned a little after the session itself can no longer be paid.
const CHECKOUT_SESSION_MINUTES = 31;
const ABANDONED_CARD_ORDER_MINUTES = 45;

module.exports = { COD_MAX_AMOUNT, CHECKOUT_SESSION_MINUTES, ABANDONED_CARD_ORDER_MINUTES };
