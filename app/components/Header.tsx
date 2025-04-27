import React from 'react';
import Link from 'next/link';
import { FaLeaf } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 bg-primary-600 shadow-md mb-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <FaLeaf className="text-white text-3xl" />
          <span className="font-bold text-2xl text-white">PlantID</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-white hover:text-primary-200 font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" className="text-white hover:text-primary-200 font-medium">
                About
              </Link>
            </li>
            <li>
              <Link href="#help" className="text-white hover:text-primary-200 font-medium">
                How it works
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;