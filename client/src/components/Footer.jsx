import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">KASDRA MART</h2>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for premium products. We bring quality and style right to your doorstep with exclusive deals.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-pink-500 transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-pink-500 transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-pink-500 transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-pink-500 transition-colors"><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-pink-500 transition-colors">Shop All</Link></li>
              <li><Link to="/wishlist" className="hover:text-pink-500 transition-colors">Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-pink-500 transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-pink-500" />
                <span className="text-sm">123 Street , Kolkata</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-pink-500" />
                <span className="text-sm">+91 7865952310</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-pink-500" />
                <span className="text-sm">support@kasdramart.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Newsletter</h3>
            <p className="text-sm mb-4">Subscribe to get special offers and once-in-a-lifetime deals.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} KASDRA MART. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
