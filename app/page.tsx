'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import CameraCapture from './components/CameraCapture'; // Import the new component
import IdentificationResult from './components/IdentificationResult';
import { PlantInfo } from './components/PlantCard';
import { FaLeaf, FaCamera, FaInfoCircle, FaUpload } from 'react-icons/fa';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plant, setPlant] = useState<PlantInfo | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setPlant(null);
    
    try {
      // Create image URL for preview
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);

      // Create form data for API request
      const formData = new FormData();
      formData.append('image', file);

      // Send request to our API endpoint
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to identify plant');
      }

      setPlant(data.plant);
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Identify Any Plant Instantly
          </h1>
          <p className="text-xl text-gray-1100 max-w-3xl mx-auto">
            Simply upload a photo or take a picture of a plant and our AI will identify it for you,
            providing useful information and care instructions.
          </p>
        </section>

        <section className="mb-16">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-full flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full transition ${
                  activeTab === 'upload'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaUpload />
                <span>Upload</span>
              </button>
              
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full transition ${
                  activeTab === 'camera'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaCamera />
                <span>Camera</span>
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'upload' ? (
            <FileUpload onImageUpload={handleImageUpload} isLoading={isLoading} />
          ) : (
            <CameraCapture onImageCapture={handleImageUpload} isLoading={isLoading} />
          )}
          
          <IdentificationResult plant={plant} error={error} imageUrl={imageUrl} />
        </section>

        <section id="about" className="mb-16">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="text-primary-500 mr-2" />
              About PlantID
            </h2>
            <p className="text-gray-700">
              PlantID uses advanced AI powered by Google Gemini to identify plants from images.
              Whether you're a gardening enthusiast, a hiker curious about flora, or someone who
              wants to learn more about the plants around you, our tool provides accurate
              identification and valuable information to help you understand and care for plants.
            </p>
          </div>
        </section>

        <section id="help" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCamera className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Take a Photo</h3>
              <p className="text-gray-600">
                Snap a clear photo of the plant you want to identify. Try to include the leaves, flowers, or distinctive features.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Identification</h3>
              <p className="text-gray-600">
                Our AI analyzes the image and identifies the plant species within seconds using advanced computer vision.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn More</h3>
              <p className="text-gray-600">
                Discover detailed information about the plant, including care instructions, native region, and interesting facts.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}