'use client';

import React, { useEffect, useState } from 'react';
import { Client, Databases, Query } from "appwrite";
import { useUser } from '@clerk/nextjs';
import { FaHeart } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs'; // Loading spinner icon
import Link from 'next/link';
// Import styles

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("668ff2cf00156a440de2");

const databases = new Databases(client);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await databases.listDocuments(
          "668ff318000fda4f53d0", // Database ID
          "66908cea0038d0660be5",  // Collection ID
          [Query.orderDesc('time')] // Order by creation time in descending order
        );
        setPosts(response.documents);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false); // Set loading to false once posts are fetched
      }
    };

    fetchPosts();
  }, []);

  const toggleCaption = (postId) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleLike = async (postId) => {
    if (!user || !isSignedIn) return;

    const post = posts.find(p => p.$id === postId);
    if (!post) return;

    const likes = post.likes || [];
    const userId = user.id;
    const hasLiked = likes.includes(userId);

    // Optimistically update the UI
    const updatedLikes = hasLiked ? likes.filter(id => id !== userId) : [...likes, userId];
    setPosts(posts.map(p => p.$id === postId ? { ...p, likes: updatedLikes } : p));

    try {
      await databases.updateDocument(
        "668ff318000fda4f53d0", // Database ID
        "66908cea0038d0660be5", // Collection ID
        postId,
        { likes: updatedLikes }
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert the optimistic update on error
      setPosts(posts.map(p => p.$id === postId ? { ...p, likes } : p));
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto my-8 lg:px-20 ">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <BsThreeDots className="animate-spin text-4xl text-gray-600" />
        </div>
      ) : (
        <div className="">
          {posts.map((post) => (
            <div key={post.$id} className="rounded-lg overflow-hidden shadow-lg mb-6">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 overflow-hidden rounded-full mr-4">
                    <img src={post.userimg} alt="User Image" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <Link href={`/message/${post.user}`} ><h1 className="font-bold">{post.name}</h1></Link>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">{formatDate(post.time)}</span>
                </div>
              </div>
              <div className="w-full h-96">
                <img src={post.imageUrl} alt="Post Image" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h1 className="font-bold">{post.title}</h1>
                <p className={`text-blue-600 ${expandedCaptions[post.$id] ? 'block' : 'line-clamp-2'}`}>
                  {post.caption}
                </p>
                {post.caption > 100 && (
                  <button
                    onClick={() => toggleCaption(post.$id)}
                    className="text-blue-500 hover:underline"
                  >
                    {expandedCaptions[post.$id] ? 'Show less' : 'Show more'}
                  </button>
                )}
                <div className="flex items-center mt-4">
                  <button onClick={() => toggleLike(post.$id)}>
                    <FaHeart
                      className={`mr-2 like-icon ${post.likes?.includes(user.id) ? 'liked' : 'not-liked'}`}
                    />
                  </button>
                  <span>{post.likes ? post.likes.length : 0} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
