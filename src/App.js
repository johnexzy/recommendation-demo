import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [embeddingResult, setEmbeddingResult] = useState(null);
  const [similarTexts, setSimilarTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('authToken');
    const expirationTime = localStorage.getItem('tokenExpiration');
    
    if (token && expirationTime && new Date().getTime() < parseInt(expirationTime)) {
      setIsLoggedIn(true);
    } else {
      // Token expired or not present
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiration');
      setIsLoggedIn(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:9000/login', { username, password });
      const { accessToken } = response.data;
      
      // Save token and expiration time
      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    setIsLoggedIn(false);
  };

  const handleRequest = async (endpoint, action) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://localhost:9000/${endpoint}`,
        { text: inputText },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      action(response.data);
    } catch (error) {
      console.error(`Error ${endpoint}:`, error);
      setError(`Failed to ${endpoint} text. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const embedText = () => handleRequest('embed', (data) => {
    setEmbeddingResult(data.embedding);
    setSimilarTexts([]);
  });

  const findSimilarTexts = () => handleRequest('recommend', (data) => {
    setEmbeddingResult(null);
    setSimilarTexts(data);
  });

  if (!isLoggedIn) {
    return (
      <div className="App login-container">
        <h1>Welcome to Text Embedding</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>Text Embedding & Similarity Search</h1>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </header>
      
      <main>
        <div className="input-section">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text here..."
            rows="5"
          />
          
          <div className="button-container">
            <button onClick={embedText} disabled={isLoading} className="btn btn-primary">
              {isLoading ? 'Embedding...' : 'Embed Text'}
            </button>
            <button onClick={findSimilarTexts} disabled={isLoading} className="btn btn-primary">
              {isLoading ? 'Searching...' : 'Find Similar Texts'}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="results-section">
          {embeddingResult && (
            <div className="result-container">
              <h2>Embedding Result</h2>
              <pre>{JSON.stringify(embeddingResult, null, 2)}</pre>
            </div>
          )}

          {similarTexts.length > 0 && (
            <div className="result-container">
              <h2>Similar Texts</h2>
              <ul className="similar-texts-list">
                {similarTexts.map((text, index) => (
                  <li key={index}>
                    <span className="text-number">{index + 1}:</span> {text.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
