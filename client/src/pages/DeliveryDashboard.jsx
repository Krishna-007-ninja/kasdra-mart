import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBox, FaShippingFast, FaCheckCircle, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchAssignedOrders = async () => {
    try {
      const { data } = await api.get('/orders/delivery/myorders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.isDeliveryBoy) {
      navigate('/login');
    } else {
      fetchAssignedOrders();
    }
  }, [navigate, user]);

  const updateStatusHandler = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchAssignedOrders();
      alert(`Status updated to ${status}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Delivery Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}. Manage your assigned deliveries here.</p>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold flex items-center">
            <FaShippingFast className="mr-2" />
            Active Deliveries: {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <FaBox className="mx-auto text-gray-300 text-6xl mb-4" />
            <p className="text-xl text-gray-600">No orders assigned to you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-gray-400">#{order._id.substring(order._id.length - 8)}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{order.shippingAddress.addressLine1}</p>
                        <p className="text-xs text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-green-500 mr-3 flex-shrink-0" />
                      <p className="text-sm font-semibold text-gray-800">{order.shippingAddress.mobileNumber}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Update Progress</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateStatusHandler(order._id, 'Packed')}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-bold transition-colors"
                        disabled={order.status === 'Delivered'}
                      >
                        Packed
                      </button>
                      <button
                        onClick={() => updateStatusHandler(order._id, 'Shipped')}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-bold transition-colors"
                        disabled={order.status === 'Delivered'}
                      >
                        Shipped
                      </button>
                      <button
                        onClick={() => updateStatusHandler(order._id, 'Out for Delivery')}
                        className="text-[10px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded-lg font-bold transition-colors"
                        disabled={order.status === 'Delivered'}
                      >
                        On Way
                      </button>
                      <button
                        onClick={() => updateStatusHandler(order._id, 'Delivered')}
                        className="text-[10px] bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg font-bold transition-colors flex items-center justify-center"
                        disabled={order.status === 'Delivered'}
                      >
                        <FaCheckCircle className="mr-1" /> Delivered
                      </button>
                    </div>
                  </div>
                </div>
                <Link to={`/order/${order._id}`} className="block w-full text-center py-3 bg-gray-50 text-gray-500 text-xs font-bold hover:bg-gray-100 transition-colors">
                  View Full Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DeliveryDashboard;
