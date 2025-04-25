import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '../../features/products/productsSlice';

interface ProductCardProps {
  product: Product;
  isOwner?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getImageUrl = () => {
    try {
      // Handle case where image is a JSON string
      if (typeof product.image === 'string') {
        const parsedImages = JSON.parse(product.image);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          return `http://localhost:5000/${parsedImages[0].replace(/\\/g, '/')}`;
        }
      }
      // Handle case where images is an array
      else if (Array.isArray(product.images) && product.images.length > 0) {
        return `http://localhost:5000/${product.images[0].replace(/\\/g, '/')}`;
      }
      
      // Default image if no valid image is found
      return 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
    } catch (error) {
      console.error("Error parsing image:", error);
      return 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
    }
  };
  
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price);
  const formattedPrice = !isNaN(price) ? price.toFixed(2) : 'N/A';
  
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {isOwner && isHovered && (
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => onEdit && onEdit(product)}
              className="p-1.5 rounded-full bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow-sm transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete && onDelete(product.id)}
              className="p-1.5 rounded-full bg-white text-gray-700 hover:bg-red-500 hover:text-white shadow-sm transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">${formattedPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;