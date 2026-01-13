import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    session: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    }

    const initialState: AuthState = {
    user: null,
    session: null,
    status: 'idle',
    };

    const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
        state.user = action.payload;
        state.status = 'succeeded';
        },
        // ADD THIS REDUCER
        logout: (state) => {
        state.user = null;
        state.session = null;
        state.status = 'idle';
        },
        setLoading: (state) => {
        state.status = 'loading';
        }
    },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;