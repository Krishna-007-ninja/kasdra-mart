import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import WishlistContext from '../context/WishlistContext';
import AuthContext from '../context/AuthContext';

const Product = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const wishlistHandler = (e) => {
    e.preventDefault();
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
      <button
        onClick={wishlistHandler}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
      >
        {isInWishlist(product._id) ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-gray-400" />
        )}
      </button>
      <Link to={`/product/${product._id}`} className="block bg-gray-50 h-64 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300 p-4"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300?text=Product+Image';
          }}
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 truncate">
            {product.name}
          </h2>
        </Link>
        <div className="flex items-center mt-2 mb-4">
             {/* Rating Stars could go here */}
            <span className="text-yellow-500 font-bold mr-1">{product.rating}</span>
            <span className="text-gray-600 text-sm">({product.numReviews} reviews)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
           <Link to={`/product/${product._id}`} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors duration-200">
               View
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
