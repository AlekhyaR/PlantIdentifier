import React from 'react';
import { FaSeedling, FaSun, FaTint, FaThermometerHalf, FaGlobe } from 'react-icons/fa';

export interface PlantInfo {
  name: string;
  scientificName: string;
  description: string;
  careInstructions: {
    water: string;
    sunlight: string;
    temperature: string;
  };
  nativeRegion: string;
  imageUrl?: string;
}

interface PlantCardProps {
  plant: PlantInfo;
  imageUrl?: string;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, imageUrl }) => {
  return (
    <div className="card overflow-hidden max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/5 bg-gray-100">
          <img 
            src={imageUrl || '/images/default-plant.jpg'} 
            alt={plant.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="w-full md:w-3/5 p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{plant.name}</h2>
            <p className="text-sm italic text-gray-600">{plant.scientificName}</p>
          </div>
          
          <p className="text-gray-700 mb-4">{plant.description}</p>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Care Instructions</h3>
            
            <div className="flex items-start space-x-3">
              <FaTint className="text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700"><span className="font-medium">Water:</span> {plant.careInstructions.water}</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <FaSun className="text-yellow-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700"><span className="font-medium">Sunlight:</span> {plant.careInstructions.sunlight}</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <FaThermometerHalf className="text-red-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700"><span className="font-medium">Temperature:</span> {plant.careInstructions.temperature}</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <FaGlobe className="text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700"><span className="font-medium">Native Region:</span> {plant.nativeRegion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;