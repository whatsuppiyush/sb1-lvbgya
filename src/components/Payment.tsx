import React from 'react'
import { useNavigate } from 'react-router-dom'
import LemonSqueezyPayment from './LemonSqueezyPayment'
import { useAuth } from '../contexts/AuthContext'

const Payment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Replace with your actual LemonSqueezy variant ID for the subscription
  const variantId = '548748';

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">Complete Your Subscription</h2>
      <p className="mb-8 text-xl">You're just one step away from accessing 3000+ ad templates!</p>
      <LemonSqueezyPayment user={user} variantId={variantId} />
    </div>
  )
}

export default Payment