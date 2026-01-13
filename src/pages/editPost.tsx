import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAppDispatch } from '../app/hook';
import { updatePost } from '../features/posts/postSlice';

export const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    // Image State
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch existing data on load
    useEffect(() => {
        const fetchPost = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (data && !error) {
            setTitle(data.title);
            setContent(data.content);
            setExistingImageUrl(data.image_url); // Store the old URL here
        }
        };
        fetchPost();
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
        let finalImageUrl = existingImageUrl; // Default to old image

        // If user chose a NEW file, upload it
        if (file) {
            finalImageUrl = await handleUpload(file);
        }

        const { data, error } = await supabase
            .from('posts')
            .update({ 
            title, 
            content, 
            image_url: finalImageUrl 
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        dispatch(updatePost(data));
        navigate('/');
        } catch (err: any) {
        alert(err.message);
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            />
            
            <textarea 
            className="w-full p-3 border rounded h-40 focus:ring-2 focus:ring-blue-500 outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            />

            {/* Image Handling UI */}
            <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Image
            </label>
            
            {/* Show Preview of NEW image OR Show EXISTING image */}
            {(preview || existingImageUrl) && (
                <div className="mb-4">
                <img 
                    src={preview || existingImageUrl || ''} 
                    className="w-full h-48 object-cover rounded shadow-sm" 
                    alt="Current display"
                />
                <p className="text-xs text-gray-400 mt-1">
                    {preview ? "New image preview" : "Current saved image"}
                </p>
                </div>
            )}

            <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            </div>

            <div className="flex gap-3 pt-4">
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
                {isSubmitting ? 'Saving...' : 'Update Post'}
            </button>
            <button 
                type="button" 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
            >
                Cancel
            </button>
            </div>
        </form>
        </div>
    );
};