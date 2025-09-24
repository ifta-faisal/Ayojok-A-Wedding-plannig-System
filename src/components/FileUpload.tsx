import React, { useState, useRef } from 'react';
import { Upload, FileText, Shield, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
  uploadedFiles: File[];
  onRemoveFile: (index: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadedFiles, onRemoveFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  };
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl"></div>
      
      {/* Main upload area */}
      <div 
        className={`relative backdrop-blur-sm bg-white/70 border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50/80 scale-[1.02] shadow-xl' 
            : 'border-blue-200 hover:border-blue-300 hover:bg-white/80'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Upload icon with animation */}
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
            isDragOver ? 'bg-blue-100 scale-110' : 'bg-gradient-to-br from-blue-100 to-indigo-100'
          }`}>
            <Upload className={`w-10 h-10 transition-all duration-300 ${
              isDragOver ? 'text-blue-600 animate-bounce' : 'text-blue-500'
            }`} />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
          Drop your 3D models here
        </h3>
        
        <p className="text-gray-600 mb-8 text-lg">
          Upload STL or OBJ files to get started
        </p>
        
        {/* Upload button */}
        <button 
          onClick={handleUploadClick}
          className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center space-x-3"
        >
          <Upload className="w-5 h-5 group-hover:animate-pulse" />
          <span>Choose Files</span>
          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        {/* Security notice */}
        <div className="flex items-center justify-center space-x-2 mt-6 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Secure & confidential uploads</span>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".stl,.obj"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Uploaded files display */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Uploaded Files</span>
          </h4>
          <div className="space-y-2">
            {Array.from(uploadedFiles).map((file, index) => (
              <div key={index} className="group relative backdrop-blur-sm bg-white/60 border border-green-200 rounded-xl p-4 transition-all duration-300 hover:bg-white/80 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;