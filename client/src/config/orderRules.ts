// TODO: Move these business rules to the database once the admin business settings page exists.
// Keep in sync with server/config/orderRules.js until then.

// Cash on delivery is limited to this order total (LKR); larger orders must be paid by card.
// Applies to new and returning customers alike.
export const COD_MAX_AMOUNT = 5000;
