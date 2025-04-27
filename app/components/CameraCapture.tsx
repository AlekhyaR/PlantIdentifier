import React, { useRef, useState, useEffect } from 'react';
import { FaCamera, FaSpinner, FaTimes } from 'react-icons/fa';

interface CameraCaptureProps {
  onImageCapture: (file: File) => void;
  isLoading: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, isLoading }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Failed to access camera. Please make sure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to Blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create file from blob
            const file = new File([blob], `plant-${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            // Create preview
            const imageUrl = URL.createObjectURL(blob);
            setPreview(imageUrl);
            
            // Pass to parent component
            onImageCapture(file);
            
            // Stop camera
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    } catch (err) {
      console.error('Error capturing photo:', err);
    }
  };

  const resetCapture = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    stopCamera();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      stopCamera();
    };
  }, [preview]);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6">
        <div className="card p-8 text-center opacity-70">
          <div className="flex justify-center items-center space-x-2 text-primary-600">
            <FaSpinner className="animate-spin text-xl" />
            <span>Processing image...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="card p-6 text-center">
        {cameraActive ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-64 object-cover mx-auto"
              />
            </div>
            
            {/* Explicit styling to ensure buttons are visible */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={capturePhoto}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg flex items-center space-x-2"
                type="button"
              >
                <FaCamera className="text-lg" />
                <span>Capture</span>
              </button>
              
              <button
                onClick={stopCamera}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-lg flex items-center space-x-2"
                type="button"
              >
                <FaTimes className="text-lg" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={preview}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={resetCapture}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-lg"
                disabled={isLoading}
                type="button"
              >
                Take Another Photo
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={startCamera}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center space-x-2 mx-auto"
            disabled={isLoading}
            type="button"
          >
            <FaCamera className="text-lg" />
            <span>Take Photo with Camera</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;