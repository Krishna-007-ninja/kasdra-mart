import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaUserPlus, FaMotorcycle, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';

const DeliveryBoyListAdmin = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchDeliveryBoys = async () => {
    try {
      const { data } = await api.get('/users/deliveryboys');
      setDeliveryBoys(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchDeliveryBoys();
    }
  }, [navigate, user]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to remove this delivery boy?')) {
      try {
        await api.delete(`/users/deliveryboys/${id}`);
        fetchDeliveryBoys();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/deliveryboys', { name, email, password });
      setName('');
      setEmail('');
      setPassword('');
      setShowAddForm(false);
      fetchDeliveryBoys();
      alert('Delivery Boy Added Successfully');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Manage Delivery Boys</h1>
            <p className="text-gray-600 mt-2">Add, remove and track performance of your delivery team.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <FaUserPlus className="mr-2" />
            {showAddForm ? 'Close Form' : 'Add New Delivery Boy'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-12 animate-fade-in-down">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">New Delivery Boy Account</h2>
            <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="delivery@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deliveryBoys.map((boy) => (
              <div key={boy._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-indigo-600 p-6 text-white relative">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <FaMotorcycle size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{boy.name}</h3>
                      <p className="text-xs text-indigo-100">{boy.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHandler(boy._id)}
                    className="absolute top-6 right-6 text-indigo-200 hover:text-white transition-colors"
                    title="Remove Account"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>

                <div className="p-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                    <FaChartLine className="mr-2" /> Performance Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Assigned</p>
                      <p className="text-2xl font-extrabold text-gray-900">{boy.totalOrders || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <div className="flex items-center text-green-600 mb-1">
                        <FaCheckCircle className="mr-1 text-[10px]" />
                        <p className="text-[10px] uppercase font-bold">Completed</p>
                      </div>
                      <p className="text-2xl font-extrabold text-green-700">{boy.completedOrders || 0}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 col-span-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-600">
                          <FaClock className="mr-2 text-xs" />
                          <p className="text-[10px] uppercase font-bold">Active Deliveries</p>
                        </div>
                        <p className="text-xl font-extrabold text-blue-700">{boy.activeOrders || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6 mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${boy.totalOrders > 0 ? (boy.completedOrders / boy.totalOrders) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center italic">
                    Success Rate: {boy.totalOrders > 0 ? Math.round((boy.completedOrders / boy.totalOrders) * 100) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DeliveryBoyListAdmin;
