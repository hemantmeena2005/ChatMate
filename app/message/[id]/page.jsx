"use client";
import { useState, useEffect, useRef } from 'react';
import { Client, Databases, Query } from 'appwrite';
import { useAuth } from "@clerk/nextjs";
import dynamic from 'next/dynamic';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('668ff2cf00156a440de2'); // Replace with your actual Appwrite project ID

const databases = new Databases(client);

export default function Message({ params }) {
  const { userId } = useAuth();
  const receiverId = params.id;
  
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null); // State to track hovered message ID
  const messagesEndRef = useRef(null);

  const senderId = userId;

  useEffect(() => {
    fetchMessages();
  }, [receiverId, senderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await databases.listDocuments(
        '668ff318000fda4f53d0',
        '6690ce20001ff3ea2abc',
        [
          Query.or([
            Query.and([
              Query.equal('senderId', senderId),
              Query.equal('receiverId', receiverId)
            ]),
            Query.and([
              Query.equal('senderId', receiverId),
              Query.equal('receiverId', senderId)
            ])
          ]),
          Query.orderAsc('timestamp')
        ]
      );
      setMessages(response.documents);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await databases.createDocument(
        '668ff318000fda4f53d0',
        '6690ce20001ff3ea2abc',
        'unique()', // Replace with your document ID generation method
        {
          senderId,
          receiverId,
          content: messageContent,
          timestamp: new Date().toISOString()
        }
      );
      setMessageContent('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Error sending message.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const editMessage = async (id, newContent) => {
    try {
      await databases.updateDocument(
        '668ff318000fda4f53d0',
        '6690ce20001ff3ea2abc',
        id,
        { content: newContent }
      );
      setEditingMessageId(null);
      fetchMessages();
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await databases.deleteDocument(
        '668ff318000fda4f53d0',
        '6690ce20001ff3ea2abc',
        id
      );
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onEmojiClick = (emojiData) => {
    setMessageContent((prevInput) => prevInput + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-screen p-2 w-full">
      <div className="flex-1 p-4 overflow-y-auto">
        <div style={{ backgroundColor }} className="border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto h-[70%]">
          {messages.map((message) => (
            <div
              key={message.$id}
              className={`message ${message.senderId === senderId ? 'bg-green-200 text-green-800 self-end' : 'bg-gray-200 text-gray-800 self-start'} rounded-lg p-2 mb-2 relative`}
              style={{ alignSelf: message.senderId === senderId ? 'flex-end' : 'flex-start' }}
              onMouseEnter={() => setHoveredMessageId(message.$id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              {editingMessageId === message.$id ? (
                <div>
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={() => editMessage(message.$id, editContent)} className="bg-blue-500 text-white px-2 py-1 rounded">
                      Save
                    </button>
                    <button onClick={() => setEditingMessageId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{message.content}</p>
                  <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
                  {message.senderId === senderId && hoveredMessageId === message.$id && (
                    <div className="absolute top-0 right-0 mt-1 mr-1 flex space-x-1">
                      <button onClick={() => { setEditingMessageId(message.$id); setEditContent(message.content); }} className="text-gray-500">
                        Edit
                      </button>
                      <button onClick={() => deleteMessage(message.$id)} className="text-gray-500">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="relative flex gap-2 items-center mb-2">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="bg-gray-200 p-2 rounded-lg mr-2">
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-16 z-10">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border bg-inherit border-gray-300 p-2"
          />
          <button onClick={sendMessage} className="bg-blue-500 px-4 py-2 rounded-lg">
            Send
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Chat Background Color:</label>
          <div className="flex space-x-2 mt-1">
            <button onClick={() => setBackgroundColor('#ffffff')} className="w-6 h-6 bg-white border border-gray-300"></button>
            <button onClick={() => setBackgroundColor('#f0f0f0')} className="w-6 h-6 bg-gray-100 border border-gray-300"></button>
            <button onClick={() => setBackgroundColor('#f8e1e1')} className="w-6 h-6 bg-red-100 border border-gray-300"></button>
            <button onClick={() => setBackgroundColor('#e1f8e1')} className="w-6 h-6 bg-green-100 border border-gray-300"></button>
            <button onClick={() => setBackgroundColor('#e1e1f8')} className="w-6 h-6 bg-blue-100 border border-gray-300"></button>
          </div>
        </div>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
}
