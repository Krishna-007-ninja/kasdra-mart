import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [navigate, user]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      setDeleteLoading(true);
      try {
        await api.delete(`/products/${id}`);
        setDeleteLoading(false);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setDeleteLoading(false);
      }
    }
  };

  const createProductHandler = async () => {
    setCreateLoading(true);
    try {
      const { data } = await api.post('/products');
      setCreateLoading(false);
      navigate(`/admin/product/${data._id}/edit`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setCreateLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center hover:bg-indigo-700"
        >
          <FaPlus className="mr-2" /> Create Product
        </button>
      </div>

      {loading || createLoading || deleteLoading ? (
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
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Brand</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{product._id}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-contain rounded border border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-6 text-left">{product.name}</td>
                  <td className="py-3 px-6 text-left">${product.price}</td>
                  <td className="py-3 px-6 text-left">{product.category}</td>
                  <td className="py-3 px-6 text-left">{product.brand}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="w-4 mr-2 transform hover:text-indigo-500 hover:scale-110"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
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

export default ProductListAdmin;
