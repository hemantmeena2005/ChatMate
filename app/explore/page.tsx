import Link from 'next/link';
import React from 'react';

const About = () => {
  return (
    <div className="p-4">
      <h1 className="text-blue-500 text-3xl mb-4">About Hemant</h1>
      <p className="">
        Hemant is a second-year student pursuing B.Tech at the Indian Institute of Information Technology, Gwalior, India. Passionate about technology and innovation, he created an app aimed at connecting people globally. While the app is currently undergoing improvements, Hemant is committed to resolving issues like real-time messaging to enhance user experience.
      </p>
      <p className="mt-4">
        For any inquiries or further questions, feel free to reach out to Hemant. He welcomes discussions on his apps development and future enhancements.
      </p>
      <p className="mt-4">
        Contact  <Link href={'/contact'}>Hemant</Link>
      </p>
    </div>
  );
};

export default About;
