import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Icon, ToolBar } from "../utils/general";

export const AudioPlayer = () => {
  const wnapp = useSelector((state) => state.apps.mediaplay || {});

  console.log("AudioPlayer", wnapp);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    if (wnapp?.hide && playing) {
      handlePause();
    }
  }, [wnapp?.hide, playing]);

  useEffect(() => {
    // Load audio file if provided in props
    if (wnapp?.data && wnapp.data.info.url) {
      setAudioFile(wnapp.data.info);
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
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
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
          <div className="audioContainer p-4 w-full">
            {audioFile ? (
              <>
                <div className="audioInfo mb-4 text-center">
                  <h3 className="text-lg font-semibold">{audioFile.name}</h3>
                </div>
                <div className="audioControls flex flex-col items-center">
                  <audio
                    ref={audioRef}
                    src={audioFile.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleStop}
                  />
                  
                  <div className="progressContainer w-full mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleProgressChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="controlButtons flex items-center justify-center space-x-4 mb-4">
                    <button
                      onClick={handlePlayPause}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      <Icon fafa={playing ? "faPause" : "faPlay"} />
                    </button>
                    <button
                      onClick={handleStop}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      <Icon fafa="faStop" />
                    </button>
                  </div>
                  
                  <div className="volumeContainer flex items-center space-x-2 w-full max-w-xs">
                    <Icon
                      fafa={volume > 0 ? "faVolumeUp" : "faVolumeMute"}
                      width={16}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No audio file selected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer; 