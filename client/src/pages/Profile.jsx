import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import { FaTimes, FaTrash, FaEye } from 'react-icons/fa';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState([]);

  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name);
      setEmail(user.email);
      fetchMyOrders();
    }
  }, [navigate, user]);

  const deleteOrderHandler = async (id, status) => {
    if (status !== 'Order Placed') {
      alert('You can only delete orders that are still in "Order Placed" status.');
      return;
    }
    if (window.confirm('Are you sure you want to cancel and delete this order?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchMyOrders();
        setMessage('Order Deleted Successfully');
        setSuccess(true);
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
        setSuccess(false);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      const result = await updateProfile({ id: user._id, name, email, password });
      if (result.success) {
          setSuccess(true);
          setMessage('Profile Updated');
      } else {
          setMessage(result.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          {message && (
             <div className={`border px-4 py-3 rounded relative mb-4 ${success ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`} role="alert">
                <span className="block sm:inline">{message}</span>
            </div>
          )}
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded font-bold hover:bg-indigo-700 transition-colors duration-200"
            >
              Update
            </button>
          </form>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          {orders.length === 0 ? (
             <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                <p className="font-bold">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        <span className="font-medium">{order._id.substring(order._id.length - 8)}</span>
                      </td>
                      <td className="py-3 px-4 text-left">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="py-3 px-4 text-left font-bold text-gray-800">
                        ₹{order.totalPrice}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`py-1 px-3 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status || 'Order Placed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-3">
                          <Link
                            to={`/order/${order._id}`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="View Details"
                          >
                            <FaEye size={18} />
                          </Link>
                          {(order.status === 'Order Placed' || !order.status) && (
                            <button
                              onClick={() => deleteOrderHandler(order._id, order.status || 'Order Placed')}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Cancel Order"
                            >
                              <FaTrash size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
