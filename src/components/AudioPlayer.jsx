import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Icon, ToolBar } from "../utils/general";

export const AudioPlayer = () => {
  const wnapp = useSelector((state) => state.apps.mediaplay || {});

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [triggerBackendOnTime, setTriggerBackendOnTime] = useState(false);
  const [triggerTime, setTriggerTime] = useState(0);
  const [audioId, setAudioId] = useState(null);
  const [backendTriggered, setBackendTriggered] = useState(false);

  useEffect(() => {
    if (wnapp?.hide && playing) {
      handlePause();
    }
  }, [wnapp?.hide, playing]);

  useEffect(() => {
    if (wnapp?.data && wnapp.data.info && wnapp.data.info.url) {
      setAudioFile({
        name: wnapp.data.name,
        url: wnapp.data.info.url
      });
      
      setTriggerBackendOnTime(!!wnapp.data.info.triggerBackendOnTime);
      setTriggerTime(wnapp.data.info.triggerTime || 0);
      
      const id = wnapp.data.info.audioId || 
                (wnapp.data.info.properties && wnapp.data.info.properties.id) || 
                null;
      setAudioId(id);
      
      setBackendTriggered(false);
    } else if (wnapp?.data && wnapp.data.url) {
      setAudioFile(wnapp.data);
      
      setTriggerBackendOnTime(false);
      setTriggerTime(0);
      setAudioId(null);
      setBackendTriggered(false);
    }
  }, [wnapp?.data]);

  const handlePlayPause = () => {
    if (playing) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handlePlay = () => {
    audioRef.current.play();
    setPlaying(true);
  };

  const handlePause = () => {
    audioRef.current.pause();
    setPlaying(false);
  };

  const handleBackward = () => {
    const newTime = Math.max(0, audioRef.current.currentTime - 10);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimeUpdate = () => {
    const newCurrentTime = audioRef.current.currentTime;
    setCurrentTime(newCurrentTime);
    
    if (triggerBackendOnTime && !backendTriggered && newCurrentTime >= triggerTime) {
      triggerBackendRequest();
    }
  };
  
  const triggerBackendRequest = async () => {
    setBackendTriggered(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      const userIdentityId = userInfo.id;
      const scenarioId = localStorage.getItem('selected_scenario');
      const authToken = localStorage.getItem('auth_token');
      
      const payload = {
        userIdentityId: userIdentityId,
        scenarioId: scenarioId,
        triggerData: { 
          audioId: audioId,
          triggerApp: "AudioPlayer"
        }
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/storyengine/fileexplorer/files/trigger-app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error triggering backend:', error);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Generate a simplified waveform visualization
  const generateWaveform = () => {
    const bars = [];
    const barCount = 40;
    
    for (let i = 0; i < barCount; i++) {
      const height = Math.random() * 60 + 10; // Random height between 10-70px
      bars.push(
        <div 
          key={i} 
          className="waveform-bar" 
          style={{ 
            height: `${height}%`,
            opacity: currentTime / duration > i / barCount ? 1 : 0.5
          }}
        ></div>
      );
    }
    
    return bars;
  };

  return (
    <div
      className="audioplayer floatTab dpShad"
      data-size={wnapp?.size}
      data-max={wnapp?.max}
      style={{
        ...(wnapp?.size == "cstm" ? wnapp?.dim : null),
        zIndex: wnapp?.z,
      }}
      data-hide={wnapp?.hide}
      id={(wnapp?.icon || "mediaplay") + "App"}
    >
      <ToolBar
        app={wnapp?.action}
        icon={wnapp?.icon || "mediaplay"}
        size={wnapp?.size}
        name="Audio Player"
        invert
      />
      <div className="windowScreen flex flex-col">
        <div className="restWindow flex-grow flex">
          {audioFile ? (
            <div className="modern-audio-player">
              <div className="player-container">
                <div className="waveform-section">
                  <div className="waveform-container">
                    {generateWaveform()}
                  </div>
                </div>
                
                <div className="controls-section">
                  <div className="song-info">
                    <h1 className="song-title">{audioFile.name}</h1>
                    <p className="artist-name">Audio Sample</p>
                  </div>
                  
                  <div className="time-display">
                    {formatTime(currentTime)}
                  </div>
                  
                  <div className="progress-container">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleProgressChange}
                      className="progress-slider"
                    />
                  </div>
                  
                  <div className="player-controls">
                    <button className="control-button backward-button" onClick={handleBackward}>
                      <Icon fafa="faBackward" />
                    </button>
                    
                    <button className="control-button play-button" onClick={handlePlayPause}>
                      <Icon fafa={playing ? "faPause" : "faPlay"} />
                    </button>
                  </div>
                </div>
              </div>
              
              <audio
                ref={audioRef}
                src={audioFile.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            </div>
          ) : (
            <div className="no-audio-message">
              <Icon fafa="faMusic" width={48} className="no-audio-icon" />
              <p>No audio file selected</p>
              <p className="no-audio-help">Open an audio file from Music folder</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .modern-audio-player {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background: #b388ff;
          border-radius: 15px;
          overflow: hidden;
          padding: 20px;
        }
        
        .player-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background: #b388ff;
          border-radius: 20px;
          position: relative;
        }
        
        .waveform-section {
          flex: 1;
          background: #ffd180;
          margin: 20px;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .waveform-container {
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .waveform-bar {
          width: 2%;
          background-color: rgba(75, 0, 130, 0.5);
          border-radius: 2px;
          margin: 0 1px;
        }
        
        .controls-section {
          padding: 0 20px 20px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .song-info {
          text-align: center;
          margin-bottom: 15px;
        }
        
        .song-title {
          color: #333;
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        
        .artist-name {
          color: #555;
          font-size: 16px;
          margin: 5px 0 0 0;
        }
        
        .time-display {
          color: #333;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .player-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 15px 0;
        }
        
        .control-button {
          background: #7b1fa2;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 10px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        .control-button:hover {
          background: #9c27b0;
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .play-button {
          width: 60px;
          height: 60px;
          background: #6a1b9a;
        }
        
        .play-button:hover {
          background: #8e24aa;
        }
        
        .progress-container {
          width: 100%;
          margin-bottom: 10px;
        }
        
        .progress-slider {
          width: 100%;
          height: 6px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 3px;
          outline: none;
        }
        
        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 15px;
          background: #7b1fa2;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .no-audio-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          color: #555;
          text-align: center;
          padding: 20px;
        }
        
        .no-audio-icon {
          margin-bottom: 15px;
          opacity: 0.7;
        }
        
        .no-audio-help {
          font-size: 14px;
          opacity: 0.6;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer; 