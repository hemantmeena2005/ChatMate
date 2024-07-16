'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Client, Databases, Query } from 'appwrite';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Appwrite client and database
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('668ff2cf00156a440de2');

const databases = new Databases(client);

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const response = await databases.listDocuments(
          '668ff318000fda4f53d0', // Database ID
          '66908cea0038d0660be5', // Collection ID
          [Query.equal('user', user.id)]
        );
        setPosts(response.documents);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isLoaded, isSignedIn, user]);

  const deletePost = async (postId) => {
    try {
      await databases.deleteDocument('668ff318000fda4f53d0', '66908cea0038d0660be5', postId);
      setPosts(posts.filter(post => post.$id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const confirmDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <p>loading...</p>; // Loading state or spinner can be placed here
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 relative z-10">
      <div className="flex items-center flex-col md:flex-row">
        <div className="h-24 w-24 md:h-12 md:w-12 rounded-full overflow-hidden mb-4 md:mb-0">
          <img src={user.imageUrl} alt="User profile" className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left md:ml-4">
          <h1 className="text-3xl font-bold mb-1">Welcome to your profile</h1>
          <h2 className="text-xl font-semibold">Hello, {user.firstName}</h2>
          <p className="text-gray-600">Username: {user.username}</p>
          <p className="text-gray-600">Email: {user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
      <div className="text-center md:text-left">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Link href={'/update'}>Update</Link>
        </button>
      </div>
      <div className="mt-8">
        <h1 className="text-3xl mb-4">My posts</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map(post => (
                  <div key={post.$id} className="bg-white border rounded-lg overflow-hidden shadow-lg relative z-10">
                    <img src={post.imageUrl} alt="" className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h2 className="font-bold text-red-500">{post.title}</h2>
                      <p className="text-blue-600">{post.caption}</p>
                      <button
                        onClick={() => confirmDelete(post.$id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none"
                      >
                        <FaTrash className="text-red-200 hover:text-red-600 hover:scale-110" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4">You haven nott created any posts yet.</p>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
