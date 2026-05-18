import { useContext } from 'react';
import { Link } from 'react-router-dom';
import WishlistContext from '../context/WishlistContext';
import Product from '../components/Product';

const Wishlist = () => {
  const { wishlistItems, loading } = useContext(WishlistContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="font-bold">Your wishlist is empty</p>
          <p className="text-sm">
            <Link to="/" className="underline">
              Go back to shop
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
