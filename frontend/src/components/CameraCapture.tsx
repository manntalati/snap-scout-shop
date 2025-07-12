import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, RotateCcw, Sparkles, Zap } from 'lucide-react';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
  isLoading: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, isLoading }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: facingMode
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        onImageCapture(imageSrc);
      }
    }
  }, [onImageCapture]);

  const retake = () => {
    setCapturedImage(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        onImageCapture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="space-y-8">
      <div className="relative bg-gray-800 rounded-3xl overflow-hidden border border-gray-700">
        {!capturedImage ? (
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Live Camera</span>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={toggleCamera}
                className="w-12 h-12 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg hover:bg-black/80 transition-all duration-300 border border-gray-600"
                title="Switch Camera"
              >
                <RotateCcw className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={capture}
                disabled={isLoading}
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-white to-gray-200 rounded-lg hover:from-gray-100 hover:to-gray-300 disabled:opacity-50 transition-all duration-300 shadow-lg"
                title="Take Photo"
              >
                <Camera className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-black text-sm font-medium">Image Captured</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {!capturedImage ? (
          <>
            <button
              onClick={capture}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-white to-gray-200 text-black py-3 px-4 rounded-xl hover:from-gray-100 hover:to-gray-300 disabled:opacity-50 transition-all duration-300 flex items-center justify-center font-medium text-sm shadow-lg"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isLoading ? 'Processing...' : 'Capture Image'}
            </button>
            <label className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center justify-center cursor-pointer font-medium text-sm border border-gray-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        ) : (
          <button
            onClick={retake}
            className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center justify-center font-medium text-sm border border-gray-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Photo
          </button>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-4 bg-gray-800 backdrop-blur-sm rounded-3xl px-8 py-6 border border-gray-700">
            <div className="relative">
              <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-white animate-pulse" />
              <p className="text-white font-semibold text-lg">Analyzing your item with AI...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture; 