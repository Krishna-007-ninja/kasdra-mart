import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Layout from "../components/Layout";
import Product from "../components/Product";
import api from "../utils/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Products from DB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ["Electronics", "Grocery", "Clothes", "Stationery"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/video4.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-purple-900/60 to-pink-900/50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 lg:py-52">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              New Year <span className="text-pink-400">2026</span> Sale is Here!
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              <b>Premium collections and exclusive deals await.</b> 
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-lg"
                >
                  Shop Now
                </motion.button>
              </Link>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl border border-pink-400 hover:bg-pink-400 hover:text-black text-white font-semibold shadow-lg"
                >
                  Explore Collections
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY WISE PRODUCTS */}
      <div className="bg-gray-50 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-4 text-red-500 text-center">{error}</div>
        ) : (
          categories.map((cat) => {
            const categoryProducts = products.filter(p => p.category === cat).slice(0, 4);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={cat} className="py-12 border-b border-gray-200 last:border-0">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {cat}
                      </h2>
                      <div className="h-1 w-20 bg-pink-500 mt-2 rounded-full"></div>
                    </div>
                    <Link
                      to={`/products?category=${cat}`}
                      className="text-pink-600 font-semibold flex items-center hover:text-pink-800 transition-colors"
                    >
                      View All
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                  >
                    {categoryProducts.map((product) => (
                      <motion.div key={product._id} variants={itemVariants}>
                        <Product product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default Home;