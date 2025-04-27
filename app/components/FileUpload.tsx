import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

interface FileUploadProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageUpload, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`card p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'bg-primary-50 border-primary-400' : ''
        } ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-gray-600">Click or drag to upload a different image</p>
          </div>
        ) : (
          <div className="py-12 space-y-4">
            <FaCloudUploadAlt className="text-primary-500 text-6xl mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">
              Upload a plant photo
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Drag and drop an image here, or click to select an image from your device
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: JPG, PNG, WEBP (max 10MB)
            </p>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="mt-6 flex justify-center items-center space-x-2 text-primary-600">
          <FaSpinner className="animate-spin text-xl" />
          <span>Identifying your plant...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;