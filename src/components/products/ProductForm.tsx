import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createProduct, updateProduct, clearProductsError } from '../../features/products/productsSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Product } from '../../features/products/productsSlice';

interface ProductFormProps {
  product?: Product | null;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onCancel }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [formError, setFormError] = useState('');
  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.products);
  
  // Set form values if editing an existing product
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price?.toString() || '');
   
    }
  }, [product]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!name  || !price ) {
      setFormError('All fields are required');
      return;
    }
    
    // Convert price to number and validate
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError('Price must be a positive number');
      return;
    }
    
    // Create FormData object for image upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);

    
    // Add images to FormData if available
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }
    
    try {
      // If product exists, update it, otherwise create a new one
      if (product) {
        await dispatch(updateProduct({ id: product.id, formData }));
      } else {
        await dispatch(createProduct(formData));
      }
      
      // Clear form and close
      if (!error) {
        resetForm();
        onCancel();
      }
    } catch (err) {
      console.error('Error submitting product:', err);
    }
  };
  
  const resetForm = () => {
    setName('');

    setPrice('');

    setImages(null);
    setFormError('');
    dispatch(clearProductsError());
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      {(error || formError) && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error || formError}
        </div>
      )}
      
      <Input
        id="name"
        label="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      {/* <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="price"
          type="number"
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        
        {/* <Input
          id="category"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        /> */}
      </div>
      
      <div className="mb-4">
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
          Product Images {product ? '(Leave empty to keep current images)' : ''}
        </label>
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">You can upload up to 5 images</p>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;