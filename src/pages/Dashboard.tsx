import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchUserProducts,
  deleteProduct,
  Product,
  setCurrentProduct,
} from '../features/products/productsSlice';
import ProductGrid from '../components/products/ProductGrid';
import ProductForm from '../components/products/ProductForm';
import DeleteConfirmationModal from '../components/products/DeleteConfirmationModal';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { PlusCircle, Package } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userProducts, isLoading, error, currentProduct } = useAppSelector(
    (state) => state.products
  );
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProducts());
    }
  }, [dispatch, isAuthenticated]);

  const handleAddProduct = () => {
    dispatch(setCurrentProduct(null));
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    dispatch(setCurrentProduct(product));
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  
  const currentUserProducts = userProducts.filter(
    (product) => product.createdBy === user?.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Products</h1>
          <p className="text-gray-600">Manage your product listings</p>
        </div>
        <Button onClick={handleAddProduct}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Product
        </Button>
      </div>

      {isLoading && userProducts.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <>
          {currentUserProducts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No products yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by creating your first product listing
              </p>
              <Button onClick={handleAddProduct}>
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <ProductGrid
              products={currentUserProducts}
              isOwner={true}
              onEdit={handleEditProduct}
              onDelete={handleDeleteClick}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          product={currentProduct}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
