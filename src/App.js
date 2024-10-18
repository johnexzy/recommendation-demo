import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [embeddingResult, setEmbeddingResult] = useState(null);
  const [similarTexts, setSimilarTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async (endpoint, action) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `http://localhost:9000/${endpoint}`,
        { text: inputText },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_JWT_TOKEN}`,
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

  return (
    <div className="App">
      <h1>Text Embedding Demo</h1>
      
      <textarea 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text here..."
      />
      
      <div className="button-container">
        <button onClick={embedText} disabled={isLoading}>Embed Text</button>
        <button onClick={findSimilarTexts} disabled={isLoading}>Find Similar Texts</button>
      </div>

      {isLoading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {embeddingResult && (
        <div className="result-container">
          <h2>Embedding Result</h2>
          <pre>{JSON.stringify(embeddingResult, null, 2)}</pre>
        </div>
      )}

      {similarTexts.length > 0 && (
        <div className="result-container">
          <h2>Similar Texts</h2>
          <ul>
            {similarTexts.map((text, index) => (
              <li key={index}>
                <span className="text-number">{index + 1}:</span> {text.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
