
import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../utils/api';


const VideoPage = () => {

const navigate = useNavigate();

const [description, setDescription] = useState('');

const [file, setFile] = useState(null);

const [loading, setLoading] = useState(false);

const [status, setStatus] = useState({ type: '', message: '' });


// i. Redirect to login if no token

useEffect(() => {

const token = localStorage.getItem('token');

if (!token) {

navigate('/login');

}

}, [navigate]);


const handleUpload = async (e) => {

e.preventDefault();

if (!file) return;


// 1. Check Extension (MP4)

if (file.type !== 'video/mp4') {

setStatus({ type: 'error', message: 'Only MP4 files are allowed.' });

return;

}


// 2. Check Duration (Max 30s)

const video = document.createElement('video');

video.preload = 'metadata';

video.src = URL.createObjectURL(file);


video.onloadedmetadata = async () => {

URL.revokeObjectURL(video.src); // Clean up memory

if (video.duration > 30) {

setStatus({ type: 'error', message: 'Video must be 30 seconds or less.' });

return;

}


// Proceed with Upload

setLoading(true);

setStatus({ type: '', message: '' });


const formData = new FormData();

formData.append('file', file);

formData.append('description', description);


try {

await api.post('/video/upload-video/', formData, {

headers: { 'Content-Type': 'multipart/form-data' },

});

setStatus({ type: 'success', message: 'Upload successful!' });

setDescription('');

setFile(null);

} catch (error) {

setStatus({ type: 'error', message: 'Upload failed.' });

} finally {

setLoading(false);

}

};

};


return (

<div className="min-h-screen bg-white p-6 md:p-12 text-black font-sans">

<div className="max-w-6xl mx-auto">

<header className="mb-10 border-b-4 border-black pb-2">

<h1 className="text-4xl font-black uppercase tracking-tighter text-black">

Pulse Upload

</h1>

</header>


<section className="max-w-xl">

{/* Main Upload Box */}

<div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">

<h2 className="text-xl font-black uppercase mb-4 text-black">Upload Content</h2>

<form onSubmit={handleUpload} className="space-y-4">

<div>

<label className="block text-sm font-bold uppercase mb-1">Description</label>

<input

type="text"

accept=".mp4"

required

className="w-full border-2 border-black p-2 focus:bg-yellow-50 outline-none text-black bg-white"

value={description}

onChange={(e) => setDescription(e.target.value)}

/>

</div>

<div>

<label className="block text-sm font-bold uppercase mb-1">Video File  (&lt; 30 seconds) </label>

<input

type="file"

accept="video/*"

required

className="w-full border-2 border-black p-2 file:bg-black file:text-white file:border-none file:uppercase file:font-bold file:px-4 file:mr-4 cursor-pointer text-black"

onChange={(e) => setFile(e.target.files[0])}

/>

</div>

<button

disabled={loading}

className="w-full bg-black py-3 text-white font-black uppercase hover:bg-gray-800 disabled:bg-gray-400 active:translate-y-1 transition-all"

>

{loading ? 'Processing...' : 'Upload & Scan'}

</button>

</form>


{status.message && (

<div className={`mt-4 p-2 border-2 font-bold uppercase text-xs ${

status.type === 'success' ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'

}`}>

{status.message}

</div>

)}

</div>


{/* ii. Navigation Button (Styled like the upload button) */}

<button

onClick={() => navigate('/videos')}

className="mt-6 w-full bg-black py-4 text-white font-black uppercase hover:bg-gray-800 active:translate-y-1 transition-all flex items-center justify-center gap-2"

>

Go to Video Feed <span>→</span>

</button>

</section>

</div>

</div>

);

};


export default VideoPage;

