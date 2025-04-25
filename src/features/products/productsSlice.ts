

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  image?: string;
  user: string;
  createdAt: string;
  created_at: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}

interface ProductsState {
  products: Product[];
  userProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  userProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

// Helper: Set Auth Headers
const setAuthHeader = (getState: () => RootState) => {
  const token = getState().auth.token;
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch All Products
export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5000/api/product/products');
    console.log(response.data);
    return response.data.products || response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch products');
    }
    return rejectWithValue('Failed to fetch products');
  }
});

// Fetch Products by User
export const fetchUserProducts = createAsyncThunk(
  'products/fetchUserProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const response = await axios.get('http://localhost:5000/api/product/user/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);
      return Array.isArray(response.data) ? response.data : response.data.products || [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch user products');
      }
      return rejectWithValue('Failed to fetch user products');
    }
  }
);

// Create Product
export const createProduct = createAsyncThunk<Product, FormData, { state: RootState }>(
  'products/create',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/product/products',
        formData,
        setAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to create product');
      }
      return rejectWithValue('Failed to create product');
    }
  }
);




// Update Product
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; formData: FormData },
  { state: RootState }
>(
  'products/update',
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/product/products/${id}`,
        formData,
        setAuthHeader(getState)
      );
      return response.data.product || response.data; // Assuming your backend sends `{ product: {...} }`
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update product');
      }
      return rejectWithValue('Failed to update product');
    }
  }
);






// Delete Product
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      await axios.delete(`http://localhost:5000/api/product/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete product');
      }
      return rejectWithValue('Failed to delete product');
    }
  }
);

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearProductsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch User Products
      .addCase(fetchUserProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProducts.push(action.payload);
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;

        const updateInList = (list: Product[]) => {
          const index = list.findIndex((p) => p.id === action.payload.id);
          if (index !== -1) list[index] = action.payload;
        };

        updateInList(state.userProducts);
        updateInList(state.products);

        state.currentProduct = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProducts = state.userProducts.filter((p) => p.id !== action.payload);
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export Actions and Reducer
export const { setCurrentProduct, clearCurrentProduct, clearProductsError } = productsSlice.actions;
export default productsSlice.reducer;
