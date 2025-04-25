
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productsSlice';
import ProductGrid from '../components/products/ProductGrid';
import { Package } from 'lucide-react';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    console.log("Dispatching fetchProducts...");
    dispatch(fetchProducts())
      .unwrap()
      .then((data) => console.log("Fetched products:", data))
      .catch((err) => console.error("Fetch error:", err));
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Product</h1>
        <p className="text-lg text-gray-600">
          Discover quality products from our community
        </p>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No products available</h3>
              <p className="text-gray-500">Check back later for new products</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </>
      )}
    </div>
  );
};

export default Home;
