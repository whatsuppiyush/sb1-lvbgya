import React, { useState } from 'react';
import { User } from 'firebase/auth';

interface LemonSqueezyPaymentProps {
  user: User;
  variantId: string;
}

const LemonSqueezyPayment: React.FC<LemonSqueezyPaymentProps> = ({ user, variantId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout');
      }

      const { checkoutUrl } = await response.json();
      window.open(checkoutUrl, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('An error occurred while creating the checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {isLoading ? 'Processing...' : 'Subscribe Now'}
    </button>
  );
};

export default LemonSqueezyPayment;