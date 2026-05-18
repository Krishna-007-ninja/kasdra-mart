import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import api from '../utils/api';

const PlaceOrder = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    // Only redirect if cart is empty and we are NOT on this page because of a successful order
    // But since clearCart is called before navigate, we should be careful.
    // A better way is to check if shippingAddress exists.
    const address = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {};
    setShippingAddress(address);

    const method = localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '';
    setPaymentMethod(method);

    if (!cartItems || cartItems.length === 0) {
      // If the cart is empty, we don't necessarily want to redirect immediately 
      // if the user just clicked "Place Order". 
      // However, usually, if they land here with an empty cart, they should go back.
    }
    
    if(!address.addressLine1) {
        navigate('/shipping');
    }
    if(!method) {
        navigate('/payment');
    }
  }, [navigate]); // Removed cartItems from dependency to avoid redirect after clearCart()


  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // SHIPPING & TAX SETTINGS
  // You can change these values as per your requirement
  const FREE_SHIPPING_THRESHOLD = 500; // Free shipping for orders above ₹500
  const DEFAULT_SHIPPING_CHARGE = 50;  // Flat ₹50 shipping charge
  const GST_RATE = 0.18;               // 18% GST

  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  
  const shippingPrice = addDecimals(itemsPrice > FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_CHARGE);
  const taxPrice = addDecimals(Number((GST_RATE * itemsPrice).toFixed(2))); 
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold mb-4">Shipping</h2>
            <div className="text-gray-700 space-y-1">
              <p><strong>Address: </strong>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p className="ml-17">{shippingAddress.addressLine2}</p>}
              <p className="ml-17">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}</p>
              <p><strong>Mobile: </strong>{shippingAddress.mobileNumber}</p>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <p className="text-gray-700">
              <strong>Method: </strong>
              {paymentMethod}
            </p>
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <Link
                        to={`/product/${item.product}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-gray-700">
                      {item.qty} x ₹{item.price} = ₹
                      {(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{shippingPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>₹{taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <button
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded font-bold mt-6 hover:bg-indigo-700 transition-colors duration-200"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
