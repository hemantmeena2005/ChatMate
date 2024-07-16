"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Client, Databases, Query } from "appwrite";
import { useUser } from '@clerk/nextjs';
import { FaHeart } from 'react-icons/fa';

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("668ff2cf00156a440de2");

const databases = new Databases(client);

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const notifiedLikes = useRef(new Set());

  // Fetch posts from the database
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
      }
    };

    fetchPosts();
  }, []);

  // Check for new likes in posts and show notifications
  useEffect(() => {
    const checkForNewLikes = () => {
      posts.forEach((post) => {
        if (post.user === user.id && post.likes) {
          post.likes.forEach((like) => {
            const likeKey = `${post.$id}-${like}`;
            if (!notifiedLikes.current.has(likeKey)) {
              notifiedLikes.current.add(likeKey);
              const likerName = posts.find(p => p.user === like)?.name || 'Unknown User';
              const newNotification = {
                id: notifications.length + 1,
                message: `User <span class="text-blue-500 font-semibold">${likerName}</span> liked your post.`,
                timestamp: new Date().toLocaleString(),
              };
              setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
            }
          });
        }
      });
    };

    checkForNewLikes();
  }, [posts, user]);

  return (
    <div className="max-w-lg mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <div className="shadow-md rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4">
              <FaHeart className='text-pink-500' />
              <p className=" font-semibold" dangerouslySetInnerHTML={{ __html: notification.message }}></p>
              <p className=" text-sm">{notification.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
