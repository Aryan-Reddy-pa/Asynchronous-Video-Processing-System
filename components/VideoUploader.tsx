import React, { useState } from 'react';
import { Upload, Film, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { VideoContainer, ResolutionProfile, PROFILE_DETAILS, CONTAINER_DETAILS } from '../types';
import * as api from '../services/mockBackend';

interface VideoUploaderProps {
  onUploadComplete: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleVariant = (container: VideoContainer, profile: ResolutionProfile) => {
    const key = `${container}:${profile}`;
    const newSet = new Set(selectedVariants);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setSelectedVariants(newSet);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // 200MB limit check as per requirements
      if (selectedFile.size > 200 * 1024 * 1024) {
        setError("File size exceeds 200MB limit.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (selectedVariants.size === 0) {
      setError("Please select at least one output variant.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 1. Upload Video
      const uploadedVideo = await api.uploadVideoFile(file);

      // 2. Create Tasks for each selected variant
      const taskPromises = Array.from(selectedVariants).map(variantKey => {
        const [container, profile] = (variantKey as string).split(':') as [VideoContainer, ResolutionProfile];
        return api.createProcessingTask(uploadedVideo.id, container, profile);
      });

      await Promise.all(taskPromises);
      
      // Reset form
      setFile(null);
      setSelectedVariants(new Set());
      onUploadComplete();
    } catch (err) {
      setError("Failed to upload video or create tasks.");
    } finally {
      setIsUploading(false);
    }
  };

  const getVariantKey = (c: VideoContainer, p: ResolutionProfile) => `${c}:${p}`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-indigo-600" />
        New Processing Job
      </h2>

      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Source Video (Max 200MB)</label>
        <div className="flex items-center justify-center w-full">
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {file ? (
                <>
                  <Film className="w-8 h-8 text-green-500 mb-2" />
                  <p className="text-sm text-green-700 font-medium">{file.name}</p>
                  <p className="text-xs text-green-600">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">MP4, MOV, WebM</p>
                </>
              )}
            </div>
            <input type="file" className="hidden" accept=".mp4,.mov,.webm" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      {/* Variant Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">2. Select Output Variants</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(VideoContainer).map((container) => (
            <div key={container} className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{container} ({CONTAINER_DETAILS[container]})</h3>
              {Object.values(ResolutionProfile).map((profile) => {
                const isSelected = selectedVariants.has(getVariantKey(container, profile));
                return (
                  <div 
                    key={getVariantKey(container, profile)}
                    onClick={() => toggleVariant(container, profile)}
                    className={`
                      cursor-pointer flex items-center justify-between p-3 rounded-lg border text-sm transition-all
                      ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                    `}
                  >
                    <span>{PROFILE_DETAILS[profile]}</span>
                    {isSelected ? <CheckCircle className="w-4 h-4 text-indigo-500" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || selectedVariants.size === 0 || isUploading}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2
          ${(!file || selectedVariants.size === 0 || isUploading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}
        `}
      >
        {isUploading ? 'Processing Request...' : 'Upload & Start Processing'}
      </button>
    </div>
  );
};

export default VideoUploader;