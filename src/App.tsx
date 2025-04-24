import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './compoonents/NavBar';
import FormBuilder from './pages/FormBuilder';
import AudioChat from './pages/AudioChat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Main Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/form-builder" element={<FormBuilder />} />
              <Route path="/audio-chat" element={<AudioChat />} />
              <Route path="/" element={<FormBuilder />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
