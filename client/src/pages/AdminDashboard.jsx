import { Link } from 'react-router-dom';
import { FaBoxOpen, FaClipboardList, FaMotorcycle, FaUsers } from 'react-icons/fa';
import Layout from '../components/Layout';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-gray-900">Admin Control Center</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/admin/productlist" className="bg-white p-10 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center border border-gray-100 group">
              <div className="bg-indigo-100 p-6 rounded-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <FaBoxOpen size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Products</h2>
              <p className="text-gray-500 text-center">Manage your inventory, prices, and stock levels.</p>
          </Link>

          <Link to="/admin/orderlist" className="bg-white p-10 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center border border-gray-100 group">
              <div className="bg-pink-100 p-6 rounded-2xl mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                <FaClipboardList size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Orders</h2>
              <p className="text-gray-500 text-center">Track sales, update statuses, and verify payments.</p>
          </Link>

          <Link to="/admin/deliveryboys" className="bg-white p-10 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center border border-gray-100 group">
              <div className="bg-green-100 p-6 rounded-2xl mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <FaMotorcycle size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Delivery Team</h2>
              <p className="text-gray-500 text-center">Manage delivery agents and track their performance.</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
