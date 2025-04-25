import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../features/products/productsSlice';



interface ProductGridProps {
  products: Product[];
  isOwner?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}
const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700">
          {isOwner
            ? "You haven't created any products yet."
            : "No products available at the moment."}
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        
        <ProductCard
          key={product.id || index} 
          product={product}
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
