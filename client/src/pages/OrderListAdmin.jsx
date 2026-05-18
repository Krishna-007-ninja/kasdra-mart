import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaTimes, FaTrash } from 'react-icons/fa';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const OrderListAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const { data } = await api.get('/users/deliveryboys');
      setDeliveryBoys(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchOrders(), fetchDeliveryBoys()]);
        setLoading(false);
      };
      loadData();
    }
  }, [navigate, user]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const statusHandler = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const assignHandler = async (id, deliveryBoyId) => {
    try {
      await api.put(`/orders/${id}/assign`, { deliveryBoyId });
      fetchOrders();
      alert('Delivery Boy Assigned Successfully');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-800 text-white uppercase text-xs leading-normal">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Assign Delivery</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    <span className="font-medium">...{String(order._id).substring(String(order._id).length - 8)}</span>
                  </td>
                  <td className="py-3 px-4 text-left">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{order.user ? order.user.name : 'Deleted User'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-left">
                    {order.createdAt ? String(order.createdAt).substring(0, 10) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-left font-bold text-gray-900">₹{order.totalPrice}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <span className={`py-1 px-3 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status || 'Order Placed'}
                      </span>
                      <select
                        className="text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                        value={order.status || 'Order Placed'}
                        onChange={(e) => statusHandler(order._id, e.target.value)}
                      >
                        <option value="Order Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-32"
                      value={order.deliveryBoy || ''}
                      onChange={(e) => assignHandler(order._id, e.target.value)}
                    >
                      <option value="">Select Boy</option>
                      {deliveryBoys.map((boy) => (
                        <option key={boy._id} value={boy._id}>
                          {boy.name} ({boy.activeOrders || 0} active)
                        </option>
                      ))}
                    </select>
                    {order.deliveryBoy && (
                       <p className="text-[10px] text-green-600 mt-1 font-semibold">Assigned</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <Link
                        to={`/order/${order._id}`}
                        className="bg-indigo-500 text-white py-1 px-3 rounded text-xs hover:bg-indigo-600 transition-colors"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => deleteHandler(order._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded text-xs hover:bg-red-600 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListAdmin;
