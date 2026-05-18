import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import CartContext from '../context/CartContext';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
            <p className="font-bold">Your cart is empty</p>
            <p className="text-sm"><Link to="/" className="underline">Go Back</Link></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div>
                    <Link
                      to={`/product/${item.product}`}
                      className="text-lg font-semibold hover:text-indigo-600"
                    >
                      {item.name}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold">₹{item.price}</span>
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      addToCart(
                        { ...item, _id: item.product },
                        Number(e.target.value)
                      )
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              <p className="text-2xl font-bold mb-6">
                ₹
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </p>
              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded font-bold hover:bg-indigo-700 transition-colors duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
