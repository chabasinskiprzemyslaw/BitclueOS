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

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
    setBackendTriggered(false);
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
          <div className="audio-player-container">
            {audioFile ? (
              <>
                <div className="audio-artwork">
                  <div className="artwork-circle">
                    <Icon fafa="faMusic" width={36} />
                  </div>
                </div>
                
                <div className="audio-info">
                  <h3 className="audio-title">{audioFile.name}</h3>
                  <p className="audio-artist">Audio Sample</p>
                </div>
                
                <audio
                  ref={audioRef}
                  src={audioFile.url}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleStop}
                />
                
                <div className="audio-controls-wrapper">
                  <div className="progress-container">
                    <div className="time-display">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div className="progress-bar-container">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="progress-slider"
                      />
                      <div 
                        className="progress-filled"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="control-panel">
                    <div className="control-buttons">
                      <button
                        onClick={handleStop}
                        className="control-button stop-button"
                        aria-label="Stop"
                      >
                        <Icon fafa="faStop" />
                      </button>
                      <button
                        onClick={handlePlayPause}
                        className="control-button play-button"
                        aria-label={playing ? "Pause" : "Play"}
                      >
                        <Icon fafa={playing ? "faPause" : "faPlay"} />
                      </button>
                    </div>
                    
                    <div className="volume-control">
                      <Icon
                        fafa={volume > 0 ? "faVolumeUp" : "faVolumeMute"}
                        width={16}
                        className="volume-icon"
                      />
                      <div className="volume-slider-container">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="volume-slider"
                        />
                        <div 
                          className="volume-filled"
                          style={{ width: `${volume * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-audio-message">
                <Icon fafa="faMusic" width={48} className="no-audio-icon" />
                <p>No audio file selected</p>
                <p className="no-audio-help">Open an audio file from Music folder</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer; 