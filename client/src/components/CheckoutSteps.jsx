import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mb-8">
      <div className="flex flex-col items-center">
        {step1 ? (
          <Link to="/login" className="text-indigo-600 font-semibold">Sign In</Link>
        ) : (
          <span className="text-gray-400">Sign In</span>
        )}
        <div className={`h-1 w-16 mt-2 ${step1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
      </div>

      <div className="flex flex-col items-center">
        {step2 ? (
          <Link to="/shipping" className="text-indigo-600 font-semibold">Shipping</Link>
        ) : (
          <span className="text-gray-400">Shipping</span>
        )}
        <div className={`h-1 w-16 mt-2 ${step2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
      </div>

      <div className="flex flex-col items-center">
        {step3 ? (
          <Link to="/payment" className="text-indigo-600 font-semibold">Payment</Link>
        ) : (
          <span className="text-gray-400">Payment</span>
        )}
        <div className={`h-1 w-16 mt-2 ${step3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
      </div>

      <div className="flex flex-col items-center">
        {step4 ? (
          <Link to="/placeorder" className="text-indigo-600 font-semibold">Place Order</Link>
        ) : (
          <span className="text-gray-400">Place Order</span>
        )}
        <div className={`h-1 w-16 mt-2 ${step4 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
