import React from 'react'
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="text-2xl font-bold  text-yellow-500">BookyBee</div>

      {/* Middle: Links (hidden on small screens) */}
      <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <a href="#home" className="hover:text-gray-900">Home</a>
        <a href="#services" className="hover:text-gray-900">Services</a>
        <a href="#providers" className="hover:text-gray-900">Service Providers</a>
      </div>

      {/* Right: Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <a href="#login" className="text-gray-700 hover:text-gray-900">Login</a>
        <a
          href="#register"
          className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
        >
          Register
        </a>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center md:hidden py-4 space-y-2">
          <a href="#home" className="text-gray-700 hover:text-gray-900">Home</a>
          <a href="#services" className="text-gray-700 hover:text-gray-900">Services</a>
          <a href="#providers" className="text-gray-700 hover:text-gray-900">Service Providers</a>
          <a href="#login" className="text-gray-700 hover:text-gray-900">Login</a>
          <a
            href="#register"
            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
          >
            Register
          </a>
        </div>
      )}
    </nav>
  );
}



export default Navbar
