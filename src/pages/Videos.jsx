import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Search, AlertCircle, CheckCircle, Trash2, ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/video/getVideos');
      setVideos(response.data.videos ?? []);
    } catch (err) {
      setError(err.response?.status === 401 ? 'Session expired.' : 'Fetch failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Delete this asset permanently?')) return;
    try {
      await api.delete(`/video/deleteVideo/${videoId}`);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch {
      alert('Delete failed.');
    }
  };

  const filteredVideos = videos.filter(v =>
    v.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 font-black uppercase text-center text-2xl animate-pulse">Loading Archive...</div>;

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 border-b-8 border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            {/* BACK BUTTON */}
            <button 
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 font-black uppercase text-xs border-2 border-black px-3 py-1.5 transition-all !bg-white !text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:!bg-black hover:!text-white active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <ArrowLeft size={14} /> 
              Back to Upload
            </button>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">The Feed</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6" />
            <input
              type="text"
              placeholder="SEARCH..."
              className="pl-12 pr-4 py-4 border-4 border-black font-black uppercase w-full sm:w-80 text-lg outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
        </header>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredVideos.map((video) => (
            <div key={video._id} className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-[400px]">
              
              <div className="p-4 border-b-4 border-black flex justify-between items-center">
                <span className="font-black uppercase text-sm bg-black text-white px-2 py-1">@{video.username}</span>
                {video.is_flagged ? <AlertCircle className="text-red-600" size={16} /> : <CheckCircle className="text-green-600" size={16} />}
              </div>

              <div className="p-8 flex-grow flex items-center">
                <p className="font-black text-xl md:text-2xl leading-tight uppercase italic break-words">"{video.description || 'Untitled Asset'}"</p>
              </div>

              <div className="p-6 border-t-4 border-black bg-gray-50 space-y-4">
                {/* PLAY BUTTON - Navigates to Playback Route */}
                <button
                  onClick={() => navigate(`/play/${video._id}`)}
                  className="w-full flex items-center justify-center gap-2 font-black uppercase text-xs border-2 border-black px-3 py-2.5 transition-all !bg-white !text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:!bg-black hover:!text-white active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <Play size={14} className="fill-current" />
                  Play Video
                </button>
                
                <button
                  onClick={() => handleDelete(video._id)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-red-600 font-bold uppercase text-xs transition-colors"
                >
                  <Trash2 size={14} /> [ Delete Asset ]
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;