import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <CheckoutSteps step1 step2 step3 />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Payment Method
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                id="Card"
                name="paymentMethod"
                type="radio"
                value="Card"
                checked={paymentMethod === 'Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label
                htmlFor="Card"
                className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
              >
                Credit or Debit Card
              </label>
            </div>

            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                id="QR"
                name="paymentMethod"
                type="radio"
                value="QR Code"
                checked={paymentMethod === 'QR Code'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label
                htmlFor="QR"
                className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
              >
                QR Code (UPI Payment)
              </label>
            </div>

            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                id="COD"
                name="paymentMethod"
                type="radio"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label
                htmlFor="COD"
                className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
              >
                Cash on Delivery
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
