"use client";
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Import arrow icons from react-icons/fi
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const router = useRouter();
  const formRef = useRef();

  const navigateBack = () => {
    router.back(); // Navigate back to the previous route
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // Prepare template params
    const templateParams = {
      to_name: 'Recipient Name', // Replace with dynamic value or leave as is
      from_name: formRef.current.name.value,
      email: formRef.current.email.value, // Corrected field name for email
      message: formRef.current.message.value,
    };

    emailjs.send('service_7bt3l8s', 'template_azq8dpn', templateParams, 'XXnRefbKeUbVj5Y7P')
      .then((result) => {
        console.log(result.text);
        // Show success toast
        toast.success('Thank you for contacting!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Optionally, redirect or show success message upon successful email send
      }, (error) => {
        console.log(error.text);
        // Handle errors, show an alert, or log them
        toast.error('Failed to send message. Please try again later.', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    // Reset the form after submission (optional)
    e.target.reset();
  };

  return (
    <div className="p-4 w-full" >
      <div className="flex items-center mb-4">
        <span className="flex cursor-pointer" onClick={navigateBack}>
          <FiChevronLeft className="text-2xl" /> {/* Left arrow icon */}
        </span>
        <h2 className="text-xl ml-2 flex-grow text-center">Contact</h2>
        <span className="flex  cursor-pointer">
          <FiChevronRight className="text-2xl" /> {/* Right arrow icon */}
        </span>
      </div>
      <div className="  p-6 rounded-lg shadow-md">
        <form ref={formRef} onSubmit={sendEmail}>
          <p className="text-lg">Contact me:</p>
          <div className="mt-4">
            <label htmlFor="name" className="block   mb-2">Your Name:</label>
            <input type="text" id="name" name="name" className="w-full bg-inherit px-3 py-2 rounded  border-2 border-blue-500   focus:outline-none" required />
          </div>
          <div className="mt-4">
            <label htmlFor="email" className="block mb-2">Your Email:</label>
            <input type="email" id="email" name="email" className="w-full bg-inherit px-3 py-2 rounded  border-2 border-blue-500 focus:outline-none" required />
          </div>
          <div className="mt-4">
            <label htmlFor="message" className="block mb-2">Message:</label>
            <textarea id="message" name="message" rows="4" className="w-full bg-inherit px-3 py-2 rounded  border-2 border-blue-500 focus:outline-none" required></textarea>
          </div>
          <div className="mt-6">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white focus:outline-none">Send Message</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contact;
