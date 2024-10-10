const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const userId = event.queryStringParameters.userId;

  if (!userId) {
    return { statusCode: 400, body: JSON.stringify({ error: "userId is required" }) };
  }

  const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
  const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;

  try {
    const response = await axios.get(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[store_id]=${LEMON_SQUEEZY_STORE_ID}&filter[customer_id]=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      }
    );

    const hasActiveSubscription = response.data.data.some(subscription => 
      subscription.attributes.status === 'active'
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ isProUser: hasActiveSubscription })
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to check subscription status" })
    };
  }
};