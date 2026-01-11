import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import VideoUpload from './pages/Home'
import VideoGallery  from './pages/Videos'
import VideoPlayer from './pages/VideoPlayer'

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount (e.g., check localStorage for a token)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginClick = () => {
    navigate('/login'); // This tells the button where to go
  };

  return (
    <div className=""> 
      <div className="">
        <Routes>
            <Route 
              path="/" 
              element={<VideoUpload isAuthenticated={isAuthenticated} onLoginClick={handleLoginClick} />} 
            />
            <Route 
              path="/login" 
              // Pass the setter function here
              element={<Login setIsAuthenticated={setIsAuthenticated} />} 
            /> 
            <Route path='/register' element={<Register />}/>
            <Route path='/videos' element={<VideoGallery />}/>
            <Route path="/play/:videoId" element={<VideoPlayer />} />
        </Routes>
      </div>
    </div>
  )
}

export default App