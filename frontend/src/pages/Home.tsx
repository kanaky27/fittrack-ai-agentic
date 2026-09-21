import { Link } from 'react-router-dom';
import { Camera, Activity, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
        Track Your Nutrition with <span className="text-blue-600">AI</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        Simply take a photo of your meal and our advanced AI will calculate the calories and provide personalized fitness insights.
      </p>
      <div className="flex space-x-4 mb-16">
        <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-700 transition">
          Get Started
        </Link>
        <Link to="/login" className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-300 transition">
          Login
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Snap a Photo</h3>
          <p className="text-gray-500">Take a picture of your food or upload an image from your gallery.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <Zap className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
          <p className="text-gray-500">Our AI instantly identifies the food and estimates the calorie count.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Track Progress</h3>
          <p className="text-gray-500">Monitor your daily intake and stay on top of your fitness goals.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
