import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const ProductEditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
        navigate('/login');
        return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand || '');
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await api.post('/upload', formData, config);

      // Now data is an object { url: '...' }
      setImage(data.url);
      setUploading(false);
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      await api.put(`/products/${id}`, {
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      });
      setLoadingUpdate(false);
      navigate('/admin/productlist');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/admin/productlist" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        Go Back
      </Link>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        {loadingUpdate && (
             <div className="flex justify-center mb-4">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
             </div>
        )}
        {error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        )}
        {loading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
             </div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                id="price"
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={price}
                onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image (Cloud Storage)</label>
              <div className="mt-1 flex flex-col space-y-4">
                {/* Manual URL Input */}
                <input
                  type="text"
                  placeholder="Enter image URL manually or upload below"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {/* File Upload */}
                  <label className="flex-1 min-w-[150px] cursor-pointer bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 transition-all flex flex-col items-center justify-center space-y-2 group hover:border-indigo-400">
                    <div className="bg-indigo-50 p-2 rounded-full group-hover:bg-indigo-100 transition-colors">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={uploadFileHandler}
                    />
                  </label>

                  {/* Camera Capture */}
                  <label className="flex-1 min-w-[150px] cursor-pointer bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 transition-all flex flex-col items-center justify-center space-y-2 group hover:border-pink-400">
                    <div className="bg-pink-50 p-2 rounded-full group-hover:bg-pink-100 transition-colors">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Take Photo</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                      onChange={uploadFileHandler}
                    />
                  </label>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-pulse">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                    <span className="text-sm font-bold text-indigo-700">Uploading to Cloudinary...</span>
                  </div>
                )}
              </div>

              {image && (
                <div className="mt-6">
                  <div className="relative group overflow-hidden rounded-2xl border-4 border-white shadow-xl bg-gray-100">
                    <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Live Preview
                    </div>
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-72 object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+or+Broken+Link';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                id="brand"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Grocery">Grocery</option>
                <option value="Clothes">Clothes</option>
                <option value="Stationery">Stationery</option>
              </select>
            </div>

            <div>
              <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">Count In Stock</label>
              <input
                type="number"
                id="countInStock"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={countInStock}
                onChange={(e) => setCountInStock(Math.max(0, Number(e.target.value)))}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded font-bold hover:bg-indigo-700 transition-colors duration-200"
            >
              Update
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditAdmin;
