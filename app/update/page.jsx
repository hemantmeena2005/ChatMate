'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Update = () => {
    const { user } = useUser();
    const [form, setForm] = useState({
        username: '',
        email: '',
        imageUrl: ''
    });

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // Example: Update user profile using Clerk API or other backend service
            const updatedUser = await fetch('/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    username: form.username,
                    email: form.email,
                    imageUrl: form.imageUrl
                })
            });

            if (updatedUser.ok) {
                toast.success('Profile updated successfully');
                console.log('Profile updated successfully:', await updatedUser.json());
                // Optionally, you can update user state or perform other actions after successful update
            } else {
                toast.error('Failed to update profile');
                console.error('Failed to update profile');
                // Handle error condition appropriately
            }
        } catch (error) {
            toast.error('Error updating profile');
            console.error('Error updating profile:', error);
            // Handle error condition appropriately
        }

        // Clear form fields after submission
        setForm({
            username: '',
            email: '',
            imageUrl: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Update Your Profile</h1>
            <form onSubmit={handleUpdate}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">New Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">New Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Update
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Update;
