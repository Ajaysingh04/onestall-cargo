import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type UserRole = 'super_admin' | 'operations' | 'franchise' | 'warehouse' | 'seller' | 'rider' | 'customer';

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  token?: string;
  phone?: string;
  businessName?: string;
  assignedPincodes?: string[];
  walletBalance?: number;
}

// Demo users seeded in database for quick role preview
export const DEMO_PROFILES: Record<string, UserInfo> = {
  customer: {
    _id: 'cust-demo-01',
    name: 'Ajay Sharma',
    email: 'customer@onestall.in',
    role: 'customer',
    isAdmin: false,
    phone: '+91 98765 43210',
    walletBalance: 1500,
  },
  seller: {
    _id: 'seller-demo-01',
    name: 'Apex Brands India',
    email: 'seller@onestall.in',
    role: 'seller',
    isAdmin: false,
    businessName: 'Apex Retailers Private Limited',
    phone: '+91 98888 11112',
    walletBalance: 42350,
  },
  franchise: {
    _id: 'fran-demo-01',
    name: 'Vikram Malhotra',
    email: 'franchise@onestall.in',
    role: 'franchise',
    isAdmin: false,
    businessName: 'OneStall Delhi Central Logistics Hub',
    assignedPincodes: ['110001', '110002', '110020'],
    walletBalance: 57600,
  },
  rider: {
    _id: 'rider-demo-01',
    name: 'Rahul Sharma',
    email: 'rider@onestall.in',
    role: 'rider',
    isAdmin: false,
    phone: '+91 98112 34567',
    assignedPincodes: ['110001', '110020'],
    walletBalance: 3200,
  },
  warehouse: {
    _id: 'wh-demo-01',
    name: 'Okhla Hub Operator',
    email: 'warehouse@onestall.in',
    role: 'warehouse',
    isAdmin: false,
    phone: '+91 98111 55667',
    walletBalance: 0,
  },
  super_admin: {
    _id: 'admin-demo-01',
    name: 'Super Operations Admin',
    email: 'admin@onestall.in',
    role: 'super_admin',
    isAdmin: true,
    phone: '+91 99999 00001',
    walletBalance: 250000,
  },
};

const userInfoFromStorage: UserInfo | null = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')!)
  : null;

interface AuthState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (userData: any, { rejectWithValue }) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/users/login', userData, config);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const register = createAsyncThunk('auth/register', async (userData: any, { rejectWithValue }) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/users', userData, config);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('userInfo');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    userLogout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    switchDemoRole: (state, action: PayloadAction<keyof typeof DEMO_PROFILES>) => {
      const selected = DEMO_PROFILES[action.payload];
      if (selected) {
        state.userInfo = selected;
        localStorage.setItem('userInfo', JSON.stringify(selected));
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.userInfo = null;
    });
  },
});

export const { clearError, switchDemoRole, userLogout } = authSlice.actions;
export default authSlice.reducer;
