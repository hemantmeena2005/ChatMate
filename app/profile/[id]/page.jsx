"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client, Databases } from 'appwrite';
import Link from 'next/link';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite API Endpoint
  .setProject('668ff2cf00156a440de2'); // Your Appwrite Project ID

const databases = new Databases(client);

const Profile = ({params}) => {
  const router = useRouter();
  const  userId  = params.id; // Get userId from route parameters
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await databases.getDocument(
          '668ff318000fda4f53d0', // Your database ID
          '66908cea0038d0660be5', // Your collection ID
          userId // Document ID (user ID in this case)
        );
        setUser(response);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className='flex items-center'>
        <div className='h-12 w-12 rounded-full overflow-hidden'>
          <img src={user.userimg} alt="User profile" className='w-full h-full object-cover' />
        </div>
        <div className='ml-4'>
          <h1 className="text-3xl font-bold mb-1">Profile: {user.name}</h1>
          <p className="text-gray-600">Username: {user.name}</p>
          <Link href={`/message/${user.user}`}>Message</Link>
          {/* Add more fields as per your user data structure */}
          
        </div>
      </div>
      {/* Add more sections to display additional user information */}
    </div>
  );
};

export default Profile;
