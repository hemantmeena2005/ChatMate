"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  // Function to determine if a link is active based on current route
  const isActive = (href) => router.pathname === href;

  return (
    <div className="flex flex-col gap-3">
      <Link href="/home" passHref>
        <span className={`text-gray-600 hover:text-gray-900 ${isActive('/home') ? 'text-red-500' : ''}`}>
          Home
        </span>
      </Link>
      
      <Link href="/messages" passHref>
        <span className={`text-gray-600 hover:text-gray-900 ${isActive('/messages') ? 'text-red-500' : ''}`}>
          Messages
        </span>
      </Link>
      <Link href="/myprofile" passHref>
        <span className={`text-gray-600 hover:text-gray-900 ${isActive('/myprofile') ? 'text-red-500' : ''}`}>
          My Profile
        </span>
      </Link>
      <Link href="/notification" passHref>
        <span className={`text-gray-600 hover:text-gray-900 ${isActive('/notification') ? 'text-red-500' : ''}`}>
          Notifications
        </span>
      </Link>
      <Link href="/search" passHref>
        <span className={`text-gray-600 hover:text-gray-900 ${isActive('/search') ? 'text-red-500' : ''}`}>
          Search
        </span>
      </Link>
      <Link href="/post" passHref>
        <span className={`text-gray-600 hover:text-gray-900 ${isActive('/post') ? 'text-red-500' : ''}`}>
          Add post
        </span>
      </Link>
      <Link href="/explore" passHref>
        <span className={`text-gray-600 hover:text-gray-900 ${isActive('/explore') ? 'text-red-500' : ''}`}>
          About Us
        </span>
      </Link>
      <Link href="/contact" passHref>
        <span className={`text-gray-600 hover:text-gray-900 ${isActive('/explore') ? 'text-red-500' : ''}`}>
          Contact
        </span>
      </Link>
    </div>
  );
};

export default Sidebar;
