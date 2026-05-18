import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../utils/api';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when product changes
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, Number(qty));
    navigate('/cart');
  };

  const wishlistHandler = () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm">
          <div className="flex justify-center bg-white p-4 rounded-lg shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[500px] w-full object-contain"
            />
          </div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <button
                onClick={wishlistHandler}
                className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
              >
                {isInWishlist(product._id) ? (
                  <FaHeart className="text-red-500 text-2xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-2xl" />
                )}
              </button>
            </div>
            <div className="flex items-center mb-4">
               <span className="text-yellow-500 font-bold text-xl mr-2">{product.rating} Stars</span>
               <span className="text-gray-600">({product.numReviews} Reviews)</span>
            </div>
            <p className="text-2xl font-bold mb-4">₹{product.price}</p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Price:</span>
                    <span className="text-xl font-bold">₹{product.price}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Status:</span>
                    <span className={product.countInStock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                {product.countInStock > 0 && (
                    <div className="flex justify-between items-center mb-6">
                         <span className="font-semibold">Qty:</span>
                         <select
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, Math.min(product.countInStock, Number(e.target.value))))}
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-indigo-500"
                         >
                            {[...Array(product.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                </option>
                            ))}
                         </select>
                    </div>
                )}

                <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className={`w-full py-3 px-4 rounded font-bold text-white transition-colors duration-200 ${
                        product.countInStock > 0
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
