const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create Stripe checkout session
router.post('/create-session', async (req, res) => {
  try {
    console.log('Received checkout request:', req.body);

    const { items, deliveryInfo, totalAmount } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!deliveryInfo || !deliveryInfo.name || !deliveryInfo.phone) {
      return res.status(400).json({ error: 'Delivery information is required' });
    }

    console.log('Processing items:', items);

    // Convert items to Stripe line items
    const lineItems = items.map(item => {
      console.log(`Processing item: ${item.name}, price: ${item.price}, quantity: ${item.quantity}`);
      
      return {
        price_data: {
          currency: 'lkr', // Sri Lankan Rupees
          product_data: {
            name: item.name,
            // Note: Stripe requires public URLs for images
            // images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents/paisa
        },
        quantity: item.quantity || 1,
      };
    });

    console.log('Line items created:', lineItems);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/menu?canceled=true`,
      customer_email: deliveryInfo.email || undefined,
      metadata: {
        customerName: deliveryInfo.name,
        customerPhone: deliveryInfo.phone,
        deliveryAddress: deliveryInfo.address || '',
        totalAmount: totalAmount.toString(),
        orderItems: JSON.stringify(items.map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price
        })))
      },
      // Enable shipping address collection for Sri Lanka
      shipping_address_collection: {
        allowed_countries: ['LK'],
      },
      billing_address_collection: 'required',
      // Add phone number collection
      phone_number_collection: {
        enabled: true
      },
    });

    console.log('Stripe session created:', {
      id: session.id,
      url: session.url,
      status: session.status
    });

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Verify payment success (optional - for order confirmation)
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log('Verifying session:', sessionId);
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('Session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      customer_details: session.customer_details
    });
    
    if (session.payment_status === 'paid') {
      res.json({
        success: true,
        paymentStatus: session.payment_status,
        customerDetails: session.customer_details,
        metadata: session.metadata
      });
    } else {
      res.json({
        success: false,
        paymentStatus: session.payment_status
      });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Failed to verify session' });
  }
});

// Webhook endpoint for Stripe events (optional but recommended)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.log('Webhook secret not configured, skipping signature verification');
    return res.status(400).send('Webhook secret not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment succeeded for session:', session.id);
      // Here you would typically:
      // - Save the order to your database
      // - Send confirmation email
      // - Update inventory
      // - Trigger fulfillment process
      break;
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed for:', paymentIntent.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

module.exports = router;