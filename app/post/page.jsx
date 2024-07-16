'use client';

import React, { useState } from 'react';
import { Client, Databases, ID, Storage } from 'appwrite';
import { useAuth } from '@clerk/nextjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@clerk/nextjs';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('668ff2cf00156a440de2');

const databases = new Databases(client);
const storage = new Storage(client);

const Post = () => {
  const { user } = useUser();
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }
    if (!title || !caption || !image) {
      toast.error('Please fill in all fields and select an image.');
      return;
    }

    try {
      // Upload image to storage
      const storageResponse = await storage.createFile(
        '66908e6b001dbacb886b', // Replace with your storage bucket ID
        ID.unique(),
        image
      );

      // Create document in database
      const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/66908e6b001dbacb886b/files/${storageResponse.$id}/view?project=668ff2cf00156a440de2`;
      const response = await databases.createDocument(
        '668ff318000fda4f53d0', // Database ID
        '66908cea0038d0660be5', // Collection ID
        ID.unique(),
        {
          name: user.username,
          userimg: user.imageUrl,
          user: userId,
          title: title,
          caption: caption,
          imageUrl: imageUrl,
          time: new Date().toISOString() // Add the current timestamp
        }
      );

      console.log('Post created successfully:', response);
      toast.success('Post created successfully!');
      // Reset form
      setTitle('');
      setCaption('');
      setImage(null);
    } catch (error) {
      console.log('Error creating post:', error);
      toast.error('Error creating post');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
        Post Title
      </label>
      <input
        type="text"
        id="title"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="caption">
        Post Caption
      </label>
      <input
        type="text"
        id="caption"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
        Upload Image
      </label>
      <input
        type="file"
        id="image"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Upload
      </button>
      <ToastContainer />
    </div>
  );
};

export default Post;
