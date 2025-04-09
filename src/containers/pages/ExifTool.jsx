import React, { useState } from 'react';
import '../assets/pages.scss';

const ExifTool = () => {
  const [filename, setFilename] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      if (filename.trim() === 'IMG_1234.jpg') {
        setResult({
          found: true,
          data: {
            password: 'AlexTheGreat01!',
            createdBy: 'Alex Freeman',
            created: '2023-09-15',
            lastModified: '2023-10-01'
          }
        });
      } else if (filename.trim() !== '') {
        setResult({
          found: false,
          message: 'No hidden data inside.'
        });
      } else {
        setResult(null);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <dir className="h-full w-full flex flex-col items-center justify-center">
      <div className="exiftool-container h-full">
        <div className="tool-header">
          <h1>ExifTool for local files</h1>
          <p>Extract hidden metadata from image files</p>
        </div>

        <div className="tool-content">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="filename">Enter image filename:</label>
              <input 
                type="text" 
                id="filename" 
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="type file name here to extract metadata"
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Extract Metadata'}
            </button>
          </form>

          {result && (
            <div className="result-container">
              <h2>Results</h2>
              {result.found ? (
                <div className="result-data">
                  <div className="result-item">
                    <strong>Hidden Password:</strong> 
                    <span className="password">{result.data.password}</span>
                  </div>
                  <div className="result-item">
                    <strong>Created By:</strong> {result.data.createdBy}
                  </div>
                  <div className="result-item">
                    <strong>Created:</strong> {result.data.created}
                  </div>
                  <div className="result-item">
                    <strong>Last Modified:</strong> {result.data.lastModified}
                  </div>
                </div>
              ) : (
                <div className="no-result">
                  {result.message}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="tool-footer">
          <p>ExifTool Online Version 1.0</p>
          <p>A simple web interface for the ExifTool command-line utility</p>
        </div>
      </div>
    </dir>
  );
};

export default ExifTool; 