import React from 'react';
import PlantCard, { PlantInfo } from './PlantCard';

interface IdentificationResultProps {
  plant: PlantInfo | null;
  error: string | null;
  imageUrl: string | null;
}

const IdentificationResult: React.FC<IdentificationResultProps> = ({ 
  plant, 
  error,
  imageUrl
}) => {
  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (!plant) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Plant Identified!</h2>
      <PlantCard plant={plant} imageUrl={imageUrl || undefined} />
    </div>
  );
};

export default IdentificationResult;