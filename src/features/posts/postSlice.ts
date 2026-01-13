import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Post {
    id: number;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
    image_url?: string | null;
}

interface PostsState {
    items: Post[];
    status: 'idle' | 'loading' | 'succeeded';
    page: number;
}

const initialState: PostsState = { items: [], status: 'idle', page: 0 };

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.items = action.payload;
            state.status = 'succeeded';
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setLoading: (state) => { state.status = 'loading'; },
        addPost: (state, action: PayloadAction<Post>) => { state.items.unshift(action.payload); },
        removePost: (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(p => p.id !== action.payload);
        },
        updatePost: (state, action: PayloadAction<Post>) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        },
    },
});

export const { setPosts, setLoading, addPost, removePost, updatePost, setPage } = postsSlice.actions;
export default postsSlice.reducer;