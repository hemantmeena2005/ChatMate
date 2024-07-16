"use client"
import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useRouter } from 'next/navigation'; // Use next/router instead of next/navigation
import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('668ff2cf00156a440de2');

const databases = new Databases(client);

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await databases.listDocuments(
        '668ff318000fda4f53d0', // Your database ID
        '66908cea0038d0660be5', // Your collection ID
        [
          Query.search('name', searchTerm), // Search for username field
          Query.limit(10) // Limit the number of results
        ]
      );

      // Filter unique users based on name
      const uniqueUsers = response.documents.reduce((acc, current) => {
        if (!acc.some(user => user.name === current.name)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setSearchResults(uniqueUsers);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToUserProfile = (userId) => {
    router.push(`/profile/${userId}`); // Navigate to profile page with userId
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <div className="p-4 lg:w-[80%] ">
      <h1 className="text-4xl text-blue-500 mb-3">Search Users</h1>
      <div className="p-2 px-4 relative rounded-full flex gap-2 border-blue-300 border-2 text-blue-400 items-center">
        <input
          type="text"
          className="border-none bg-white outline-none w-full py-2 px-3 rounded-full"
          placeholder="Enter username"
          value={searchTerm}
          onChange={handleChange}
        />
        <BsSearch className="absolute right-5 cursor-pointer" />
      </div>
      <div className="mt-4">
        {loading && <p>Loading...</p>}
        {!loading && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {searchResults.map((user) => (
              <div key={user.$id} className="cursor-pointer items-center px-2 flex overflow-hidden" onClick={() => goToUserProfile(user.$id)}>
                <img src={user.userimg} alt="" className="w-10 h-10 overflow-hidden rounded-full object-cover" />
                <div className="p-4">
                  <h2 className="font-bold text-black">{user.name}</h2>
                  {/* Add more fields as per your user data structure */}
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && searchResults.length === 0 && <p>No results found.</p>}
      </div>
    </div>
  );
};

export default Search;
