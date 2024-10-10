const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { variantId, userId, userEmail } = JSON.parse(event.body);

  if (!variantId || !userId || !userEmail) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing required parameters" }) };
  }

  const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
  const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;

  try {
    const response = await axios.post(
      'https://api.lemonsqueezy.com/v1/checkouts',
      {
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                user_id: userId,
              },
              email: userEmail,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMON_SQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      }
    );

    const checkoutUrl = response.data.data.attributes.url;

    return {
      statusCode: 200,
      body: JSON.stringify({ checkoutUrl })
    };
  } catch (error) {
    console.error('Error creating LemonSqueezy checkout:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create checkout" })
    };
  }
};