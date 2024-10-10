import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LemonSqueezyPayment from './LemonSqueezyPayment'

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const variantId = import.meta.env.VITE_LEMON_SQUEEZY_VARIANT_ID;

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8">Get Access to 3000+ Ad Templates</h1>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-4">Premium Plan</h2>
        <p className="text-xl mb-6">Unlock unlimited access to our entire library of ad templates</p>
        <ul className="text-left mb-8">
          <li className="mb-2">✅ 3000+ professionally designed ad templates</li>
          <li className="mb-2">✅ Regular updates with new templates</li>
          <li className="mb-2">✅ Customizable designs for all major social platforms</li>
          <li className="mb-2">✅ Priority customer support</li>
        </ul>
        <LemonSqueezyPayment user={user} variantId={variantId} />
      </div>
    </div>
  )
}

export default Pricing