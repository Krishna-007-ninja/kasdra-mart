import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../utils/api';

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        console.log('Order Data:', data);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, paymentSuccess]);

  const successPaymentHandler = async () => {
    if (order.paymentMethod === 'QR Code' && !transactionId) {
      alert('Please enter the Transaction ID after payment');
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentResult = {
        id: order.paymentMethod === 'QR Code' ? transactionId : 'simulated_card_' + Date.now(),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: order.user.email,
      };
      await api.put(`/orders/${id}/pay`, paymentResult);
      setPaymentSuccess(true);
      setPaymentLoading(false);
      alert(order.paymentMethod === 'QR Code' ? 'Payment Details Submitted! Admin will verify your transaction.' : 'Payment Successful!');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setPaymentLoading(false);
    }
  };

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
     );
  }

  if (error) {
     return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        </div>
     );
  }

  const getStatusStep = (status) => {
    const steps = ['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const index = steps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const currentStep = getStatusStep(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order {order._id}</h1>
      
      {/* Order Tracking Progress Bar */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Order Tracking</h2>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {['Placed', 'Processing', 'Packed', 'Shipped', 'On Way', 'Delivered'].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                } transition-colors duration-300`}>
                  {index <= currentStep ? '✓' : index + 1}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  index <= currentStep ? 'text-green-600' : 'text-gray-400'
                }`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        {order.status === 'Cancelled' && (
          <div className="mt-6 bg-red-100 text-red-700 p-3 rounded-lg text-center font-bold">
            This order has been Cancelled
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold mb-4">Shipping</h2>
            <p className="mb-2">
              <strong>Name: </strong> {order.user.name}
            </p>
            <p className="mb-2">
              <strong>Email: </strong>{' '}
              <a href={`mailto:${order.user.email}`} className="text-indigo-600">
                {order.user.email}
              </a>
            </p>
            <div className="mb-4">
              <strong>Address: </strong>
              <div className="text-gray-700 space-y-1 ml-4 mt-1">
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                <p><strong>Mobile: </strong>{order.shippingAddress.mobileNumber}</p>
              </div>
            </div>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded">
                Delivered on {order.deliveredAt}
              </div>
            ) : (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                Not Delivered
              </div>
            )}
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <p className="mb-2">
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            <p className="mb-4">
              <strong>Status: </strong>
              <span className={`font-bold ${order.status === 'Cancelled' ? 'text-red-600' : 'text-indigo-600'}`}>
                {order.status || 'Order Placed'}
              </span>
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded">
                Paid on {order.paidAt}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                  Not Paid
                </div>
                {/* Debug Info (Only visible to you) */}
                <div className="hidden text-[8px] text-gray-300">Method: {order.paymentMethod}</div>

                {(order.paymentMethod && (order.paymentMethod.toLowerCase().includes('qr') || order.paymentMethod.toLowerCase().includes('upi'))) ? (
                  <div className="flex flex-col items-center p-6 border rounded-lg bg-white shadow-sm">
                    <p className="text-lg font-semibold mb-2 text-gray-800">Scan to Pay: ₹{order.totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mb-4 text-center">Scan this QR using PhonePe, GPay, or Paytm</p>
                    
                    <div className="p-4 bg-white border-4 border-indigo-100 rounded-xl mb-4 min-h-[220px] flex flex-col items-center justify-center">
                      {/* Dynamic QR Code with your UPI ID */}
                      <QRCodeCanvas 
                        value={`upi://pay?pa=7865952310@mbkns&pn=KasdraMart&am=${order.totalPrice}&cu=INR`} 
                        size={220}
                        level="H"
                        includeMargin={true}
                      />
                      <p className="mt-2 text-[10px] text-gray-500 font-mono">UPI: 7865952310@mbkns</p>
                    </div>

                    <div className="w-full space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Transaction ID / UTR (Required after payment)
                        </label>
                        <input
                          type="text"
                          placeholder="Enter 12-digit UTR number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                      </div>
                      
                      <button
                        onClick={successPaymentHandler}
                        disabled={paymentLoading}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                      >
                        {paymentLoading ? 'Submitting...' : 'I Have Paid - Submit Details'}
                      </button>
                    </div>
                    
                    <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-wider">
                      Verified Merchant: Kasdra Mart
                    </p>
                  </div>
                ) : order.paymentMethod === 'Card' ? (
                   <button
                    onClick={successPaymentHandler}
                    disabled={paymentLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {paymentLoading ? 'Processing...' : 'Pay with Card'}
                  </button>
                ) : order.paymentMethod === 'Cash on Delivery' ? (
                   <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded">
                    Pay at the time of delivery.
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded italic">
                    Payment via {order.paymentMethod}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p>Order is empty</p>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
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
              <span>₹{order.itemsPrice ? order.itemsPrice.toFixed(2) : (order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>₹{order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
              <span>Total</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
