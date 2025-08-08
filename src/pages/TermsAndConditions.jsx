import React from "react";
import { Link } from "react-router-dom";

function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md my-8 overflow-y-auto" style={{ maxHeight: "80vh" }}>
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Terms and Conditions</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Welcome to SocialVibe! These terms and conditions outline the rules and regulations for the use of our website and services.
      </p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        By accessing this website we assume you accept these terms and conditions. Do not continue to use SocialVibe if you do not agree to all of the terms and conditions stated on this page.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">1. License</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Unless otherwise stated, SocialVibe and/or its licensors own the intellectual property rights for all material on SocialVibe. All intellectual property rights are reserved. You may access this from SocialVibe for your own personal use subjected to restrictions set in these terms and conditions.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">2. User Responsibilities</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of SocialVibe.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">3. Limitation of Liability</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        In no event shall SocialVibe, nor any of its officers, directors, and employees, be liable to you for anything arising out of or in any way connected with your use of this website.
      </p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
      
      </p>
      <Link to="/register" className="hover:underline text-pink-500">
                    i've read and understood the user agreement
                  </Link>
    </div>
  );
}

export default TermsAndConditions;
