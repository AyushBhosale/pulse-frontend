import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Loader2 } from 'lucide-react';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUrl = async () => {
      try {
        // Calling your FastAPI endpoint
        const response = await api.get(`/video/signed-url/?video_id=${videoId}`);
        setUrl(response.data.signed_url);
      } catch (err) {
        console.error("Failed to fetch signed URL", err);
      } finally {
        setLoading(false);
      }
    };
    getUrl();
  }, [videoId]);

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 font-black uppercase text-xs border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="max-w-5xl mx-auto border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] bg-black">
        {url ? (
          <video controls autoPlay className="w-full h-auto">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="p-20 text-white text-center font-black">VIDEO NOT FOUND</div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;