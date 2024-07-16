'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Client, Databases, ID, Query } from 'appwrite';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('668ff2cf00156a440de2'); // Replace with your actual Appwrite project ID

const databases = new Databases(client);

export default function Home() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const createUserInDb = async () => {
      if (isSignedIn && user) {
        try {
          // Check if user already exists in the database
          const existingUsers = await databases.listDocuments(
            '668ff318000fda4f53d0', // Your database ID
            '668ff31e003b76a23957', // Your collection ID
            [
              Query.equal('userid', user.id)
            ]
          );

          if (existingUsers.documents.length === 0) {
            // User does not exist, create new document
            const response = await databases.createDocument(
              '668ff318000fda4f53d0', // Your database ID
              '668ff31e003b76a23957', // Your collection ID
              ID.unique(),
              {
                userid: user.id,
                email: user.primaryEmailAddress.emailAddress,
                username: user.firstName,
                // Add any additional fields you want to store
              }
            );
            toast.success('User profile created successfully');
            console.log('User created in DB:', response);
          } else {
            console.log('User already exists in DB:', existingUsers.documents[0]);
          }

          // Redirect to dashboard or another page upon successful sign-in
        } catch (error) {
          toast.error('Error creating user profile');
          console.error('Error creating user in DB:', error);
        }
      }
    };

    createUserInDb();
  }, [isSignedIn, user, router]);

  return (
    <div className="flex flex-col -mt-10 items-center justify-center h-screen">
      {isSignedIn ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-4 text-lg">
            We are glad to see you again. Start chatting with your friends now.
          </p>
          <Link href="/home">
            <p className="bg-blue-500 mt-2 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
              Go to Home
            </p>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold leading-tight">
            Talk to strangers, <br />
            Make friends!
          </h1>
          <p className="mt-4 text-lg">
            Experience a random chat alternative to find <br /> friends, connect with people, and chat with <br /> strangers from all over the world!
          </p>
          <Link href="/sign-up">
            <p className="bg-blue-500 mt-2 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
              Sign Up
            </p>
          </Link>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
