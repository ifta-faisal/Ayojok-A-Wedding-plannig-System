import React, { useState } from 'react';
import { ChevronDown, Calculator, Zap, Palette, Layers } from 'lucide-react';

interface PrintSettingsProps {
  uploadedFiles: File[];
}

const PrintSettings: React.FC<PrintSettingsProps> = ({ uploadedFiles }) => {
  const [materialType, setMaterialType] = useState('PLA');
  const [color, setColor] = useState('White');
  const [infillDensity, setInfillDensity] = useState('20% (Light)');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const materialOptions = ['PLA', 'ABS', 'PETG', 'TPU', 'Wood Fill', 'Metal Fill'];
  const colorOptions = ['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'];
  const infillOptions = ['10% (Very Light)', '20% (Light)', '50% (Medium)', '80% (Heavy)', '100% (Solid)'];

  const calculatePrice = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file to calculate the price.');
      return;
    }

    setIsCalculating(true);
    
    setTimeout(() => {
      let totalPrice = 0;
      
      uploadedFiles.forEach(file => {
        const fileSizeMB = file.size / (1024 * 1024);
        let basePrice = fileSizeMB * 2;
        
        const materialMultipliers: { [key: string]: number } = {
          'PLA': 1.0,
          'ABS': 1.2,
          'PETG': 1.4,
          'TPU': 1.8,
          'Wood Fill': 2.2,
          'Metal Fill': 3.5
        };
        
        const colorMultipliers: { [key: string]: number } = {
          'White': 1.0,
          'Black': 1.0,
          'Red': 1.1,
          'Blue': 1.1,
          'Green': 1.1,
          'Yellow': 1.15,
          'Orange': 1.15,
          'Purple': 1.2
        };
        
        const infillMultipliers: { [key: string]: number } = {
          '10% (Very Light)': 0.8,
          '20% (Light)': 1.0,
          '50% (Medium)': 1.4,
          '80% (Heavy)': 1.8,
          '100% (Solid)': 2.2
        };
        
        basePrice *= materialMultipliers[materialType] || 1.0;
        basePrice *= colorMultipliers[color] || 1.0;
        basePrice *= infillMultipliers[infillDensity] || 1.0;
        basePrice = Math.max(basePrice, 5.0);
        totalPrice += basePrice;
      });
      
      setCalculatedPrice(Math.round(totalPrice * 100) / 100);
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="relative">
      {/* Background with gradient and glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative p-8 text-white">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Print Settings</h2>
        </div>
        
        <div className="space-y-6">
          {/* Material Type */}
          <div className="group">
            <label className="flex items-center space-x-2 text-sm font-medium text-purple-100 mb-3">
              <Layers className="w-4 h-4" />
              <span>Material Type</span>
            </label>
            <div className="relative">
              <select 
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl px-4 py-4 pr-12 appearance-none focus:ring-2 focus:ring-purple-300 focus:outline-none transition-all duration-300 hover:bg-white group-hover:shadow-lg font-medium"
              >
                {materialOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Color */}
          <div className="group">
            <label className="flex items-center space-x-2 text-sm font-medium text-purple-100 mb-3">
              <Palette className="w-4 h-4" />
              <span>Color</span>
            </label>
            <div className="relative">
              <select 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl px-4 py-4 pr-12 appearance-none focus:ring-2 focus:ring-purple-300 focus:outline-none transition-all duration-300 hover:bg-white group-hover:shadow-lg font-medium"
              >
                {colorOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Infill Density */}
          <div className="group">
            <label className="flex items-center space-x-2 text-sm font-medium text-purple-100 mb-3">
              <div className="w-4 h-4 border border-current rounded opacity-60"></div>
              <span>Infill Density</span>
            </label>
            <div className="relative">
              <select 
                value={infillDensity}
                onChange={(e) => setInfillDensity(e.target.value)}
                className="w-full bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl px-4 py-4 pr-12 appearance-none focus:ring-2 focus:ring-purple-300 focus:outline-none transition-all duration-300 hover:bg-white group-hover:shadow-lg font-medium"
              >
                {infillOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Price Display */}
        {calculatedPrice !== null && (
          <div className="mt-8 p-6 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 font-medium">Estimated Price</span>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-white">${calculatedPrice}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-purple-200 opacity-80">
              *Final price may vary based on actual model complexity
            </p>
          </div>
        )}

        {/* Calculate Button */}
        <div className="mt-8">
          <button 
            onClick={calculatePrice}
            disabled={isCalculating || uploadedFiles.length === 0}
            className="group relative w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 disabled:from-white/5 disabled:to-white/5 disabled:cursor-not-allowed text-white border border-white/30 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:hover:scale-100 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center space-x-3">
              {isCalculating ? (
                <>
                  <Calculator className="w-5 h-5 animate-spin" />
                  <span>Calculating Price...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 group-hover:animate-pulse" />
                  <span>Calculate Price</span>
                </>
              )}
            </div>
            {!isCalculating && uploadedFiles.length > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintSettings;