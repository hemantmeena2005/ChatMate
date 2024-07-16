"use client";
import React, { useEffect, useState } from 'react';
import { Client, Databases } from 'appwrite';
import { useRouter } from 'next/navigation';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('668ff2cf00156a440de2');

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const databases = new Databases(client);
        const response = await databases.listDocuments('668ff318000fda4f53d0', '668ff31e003b76a23957');
        setUsers(response.documents);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false); // Set loading to false once users are fetched or if there's an error
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (documentId) => {
    try {
      const databases = new Databases(client);
      const userDocument = await databases.getDocument('668ff318000fda4f53d0','668ff31e003b76a23957', documentId);
      if (userDocument) {
        router.push(`/message/${userDocument.userid}`);
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };

  // Loader component
  const Loader = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">All Users</h1>
      {loading ? (
        <Loader /> // Render loader while fetching data
      ) : (
        <div className="">
          {users.map(user => (
            <div key={user.$id} className=" rounded-lg shadow-md p-4 flex flex-col  cursor-pointer" onClick={() => handleUserClick(user.$id)}>
              <div className="text-start">
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
