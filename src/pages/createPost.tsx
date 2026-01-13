import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hook';
import { addPost } from '../features/posts/postSlice';

export const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // 1. Capture the file and create a local preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile)); // Local browser URL
        }
    };

    // 2. Upload the file to Supabase Storage
    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        return data.publicUrl;
    };

    // 3. Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        let imageUrl = null;
        if (file) {
            imageUrl = await uploadImage(file);
        }

        const { data, error } = await supabase
            .from('posts')
            .insert([{ 
            title, 
            content, 
            image_url: imageUrl, 
            user_id: user.id 
            }])
            .select()
            .single();

        if (error) throw error;

        dispatch(addPost(data));
        navigate('/');
        } catch (err: any) {
        alert(err.message);
        } finally {
        setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
            <input 
            placeholder="Title" 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            required 
            />
            
            <textarea 
            placeholder="What's on your mind?" 
            className="w-full p-3 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)} 
            required 
            />
            
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-200 p-4 rounded-lg">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Feature Image</label>
            
            <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {preview && (
                <div className="mt-4 relative">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <button 
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                    ✕
                </button>
                </div>
            )}
            </div>

            <button 
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:bg-gray-400"
            >
            {isUploading ? 'Publishing...' : 'Publish Post'}
            </button>
        </form>
        </div>
    );
};