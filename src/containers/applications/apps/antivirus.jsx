import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import "./assets/antivirus.scss";

export const Antivirus = () => {
  const dispatch = useDispatch();
  const wnapp = useSelector((state) => state.apps.defender) || {
    hide: true,
    size: "full",
    max: true,
    z: 0
  };
  const [scanStage, setScanStage] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [threatFound, setThreatFound] = useState(false);
  const [threatDetails, setThreatDetails] = useState(null);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([
    {
      id: "scan-1",
      date: "2023-05-15 09:23:45",
      status: "clean",
      filesScanned: 58742,
      threatCount: 0,
      duration: "1m 32s"
    },
    {
      id: "scan-2",
      date: "2023-06-02 14:17:22",
      status: "infected",
      filesScanned: 62103,
      threatCount: 1,
      threatDetails: {
        type: "Adware",
        name: "Win32/Adware.Finfisher",
        location: "C:\\Program Files\\GameLauncher\\setup.exe",
        severity: "Medium",
        description: "Advertising software that may collect user data without consent",
        action: "Removed",
        timestamp: "2023-06-02 14:17:22"
      },
      duration: "2m 05s"
    },
    {
      id: "scan-3",
      date: "2023-06-28 22:09:11",
      status: "clean",
      filesScanned: 61847,
      threatCount: 0,
      duration: "1m 48s"
    }
  ]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(false);

  // Simulating a virus scan
  useEffect(() => {
    let interval;
    if (scanning && scanProgress < 100) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + 1;
          
          // At 65% progress, trigger the threat detection
          if (newProgress === 65 && !threatFound) {
            setThreatFound(true);
            setThreatDetails({
              type: "Trojan",
              name: "Backdoor.Remote.Access",
              location: "C:\\System32\\svchost.exe",
              severity: "Critical",
              description: "Remote access trojan attempting to communicate with command and control server",
              action: "Quarantined",
              timestamp: new Date().toLocaleString()
            });
          }
          
          // Complete scan when progress reaches 100%
          if (newProgress >= 100) {
            clearInterval(interval);
            setScanComplete(true);
            setScanning(false);
            
            // Add new scan to history
            if (scanComplete) {
              const newScan = {
                id: `scan-${Date.now()}`,
                date: new Date().toLocaleString(),
                status: threatFound ? "infected" : "clean",
                filesScanned: Math.floor(Math.random() * 10000) + 50000, // Random number between 50k-60k
                threatCount: threatFound ? 1 : 0,
                duration: `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 59) + 1}s`
              };
              
              if (threatFound && threatDetails) {
                newScan.threatDetails = threatDetails;
              }
              
              setScanHistory([newScan, ...scanHistory]);
            }
          }
          
          return newProgress;
        });
      }, 50); // Adjust speed of scan here
    }
    
    return () => clearInterval(interval);
  }, [scanning, scanProgress, threatFound, threatDetails, scanHistory, scanComplete]);

  const startScan = () => {
    setScanProgress(0);
    setThreatFound(false);
    setThreatDetails(null);
    setScanComplete(false);
    setScanning(true);
    setViewingHistory(false);
    setSelectedScan(null);
  };

  const stopScan = () => {
    setScanning(false);
  };

  const renderScanButton = () => {
    if (scanning) {
      return (
        <div className="av-button stop" onClick={stopScan}>
          <Icon src="defender" width={16} />
          <span>Stop Scan</span>
        </div>
      );
    } else {
      return (
        <div className="av-button scan" onClick={startScan}>
          <Icon src="defender" width={16} />
          <span>Quick Scan</span>
        </div>
      );
    }
  };

  const viewScanDetails = (scan) => {
    console.log(scan);
    setSelectedScan(scan);
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch (e) {
      return dateStr;
    }
  };

  const toggleHistoryView = () => {
    setViewingHistory(!viewingHistory);
    setSelectedScan(null);
  };

  const renderHistoryView = () => {
    if (selectedScan) {
      return (
        <div className="av-scan-details">
          <div className="av-scan-details-header">
            <div className="av-button secondary" onClick={() => setSelectedScan(null)}>
              <Icon fafa="faArrowLeft" width={12} />
              <span>Back to History</span>
            </div>
            <h3>Scan Details - {formatDate(selectedScan.date)}</h3>
          </div>
          
          <div className="av-scan-summary">
            <div><strong>Status:</strong> 
              <span className={selectedScan.status === "clean" ? "clean" : "infected"}>
                {selectedScan.status === "clean" ? "Clean" : "Infected"}
              </span>
            </div>
            <div><strong>Files Scanned:</strong> {selectedScan.filesScanned.toLocaleString()}</div>
            <div><strong>Threats Found:</strong> {selectedScan.threatCount}</div>
            <div><strong>Duration:</strong> {selectedScan.duration}</div>
          </div>
          
          {selectedScan.status === "infected" && selectedScan.threatDetails && (
            <div className="av-threat-alert">
              <div className="av-threat-header">
                <Icon src="security" width={20} />
                <h3>Threat Detected</h3>
              </div>
              <div className="av-threat-details">
                <div><strong>Type:</strong> {selectedScan.threatDetails.type}</div>
                <div><strong>Name:</strong> {selectedScan.threatDetails.name}</div>
                <div><strong>Location:</strong> {selectedScan.threatDetails.location}</div>
                <div><strong>Severity:</strong> <span className={selectedScan.threatDetails.severity.toLowerCase()}>
                  {selectedScan.threatDetails.severity}
                </span></div>
                <div><strong>Description:</strong> {selectedScan.threatDetails.description}</div>
                <div><strong>Action taken:</strong> {selectedScan.threatDetails.action}</div>
                <div><strong>Time:</strong> {selectedScan.threatDetails.timestamp}</div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="av-history-list">
        <div className="av-history-header">
          <h3>Scan History</h3>
          <div className="av-button secondary" onClick={toggleHistoryView}>
            <span>Back to Scan</span>
          </div>
        </div>
        
        <div className="av-history-table">
          <div className="av-history-table-header">
            <div className="av-history-date">Date</div>
            <div className="av-history-status">Status</div>
            <div className="av-history-files">Files Scanned</div>
            <div className="av-history-threats">Threats</div>
            <div className="av-history-duration">Duration</div>
          </div>
          
          {scanHistory.map((scan) => (
            <div 
              key={scan.id}
              className="av-history-row" 
              onClick={() => viewScanDetails(scan)}
            >
              <div className="av-history-date">{formatDate(scan.date)}</div>
              <div className="av-history-status">
                <div className={`av-status-indicator ${scan.status}`}>
                  {scan.status === "clean" ? "Clean" : "Infected"}
                </div>
              </div>
              <div className="av-history-files">{scan.filesScanned.toLocaleString()}</div>
              <div className="av-history-threats">{scan.threatCount}</div>
              <div className="av-history-duration">{scan.duration}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="antivirusApp floatTab dpShad"
      data-size={wnapp.size}
      id={wnapp.icon + "App"}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Antivirus"
      />
      <div className="windowScreen" data-dock="true">
        <div className="av-content">
          <div className="av-header">
            <h2>Virus & threat protection</h2>
            <div className="av-status">
              {threatFound ? (
                <div className="av-status-alert">
                  <Icon src="defender" width={24} />
                  <span>Threats found!</span>
                </div>
              ) : (
                <div className="av-status-safe">
                  <Icon src="defender" width={24} />
                  <span>{scanComplete ? "Scan complete" : (scanning ? "Scanning..." : "Ready to scan")}</span>
                </div>
              )}
            </div>
          </div>

          <div className="av-main">
            {viewingHistory ? (
              renderHistoryView()
            ) : (
              <>
                <div className="av-scan-card">
                  <div className="av-scan-header">
                    <h3>Quick Scan</h3>
                    {renderScanButton()}
                  </div>

                  <div className="av-progress-container">
                    <div className="av-progress-bar">
                      <div 
                        className="av-progress-fill" 
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                    <div className="av-progress-text">
                      {scanning ? 
                        `Scanning... ${scanProgress}%` : 
                        (scanComplete ? 
                          "Scan complete. Click 'Quick Scan' to scan again." : 
                          "Click 'Quick Scan' to begin scanning for threats."
                        )
                      }
                    </div>
                  </div>

                  {scanning && (
                    <div className="av-scan-status">
                      <div className="av-scan-file">
                        Scanning: C:\\{Math.random().toString(36).substring(2, 10)}.dll
                      </div>
                      <div className="av-scan-count">
                        Files scanned: {Math.floor(scanProgress * 31)}
                      </div>
                    </div>
                  )}

                  {threatFound && (
                    <div className="av-threat-alert">
                      <div className="av-threat-header">
                        <Icon src="security" width={20} />
                        <h3>Threat Detected!</h3>
                      </div>
                      <div className="av-threat-details">
                        <div><strong>Type:</strong> {threatDetails.type}</div>
                        <div><strong>Name:</strong> {threatDetails.name}</div>
                        <div><strong>Location:</strong> {threatDetails.location}</div>
                        <div><strong>Severity:</strong> <span className="critical">{threatDetails.severity}</span></div>
                        <div><strong>Description:</strong> {threatDetails.description}</div>
                        <div><strong>Action taken:</strong> {threatDetails.action}</div>
                        <div><strong>Time:</strong> {threatDetails.timestamp}</div>
                      </div>
                      <div className="av-action-buttons">
                        <div className="av-button action">
                          <span>Remove Threats</span>
                        </div>
                        <div className="av-button secondary">
                          <span>View Details</span>
                        </div>
                      </div>
                      <div className="av-alert-message">
                        <strong>Warning:</strong> Suspicious activity detected. Someone may be attempting to gain unauthorized access to your system.
                      </div>
                    </div>
                  )}
                </div>

                <div className="av-protection-card">
                  <div className="av-history-header">
                    <h3>Protection History</h3>
                    <div className="av-button secondary" onClick={toggleHistoryView}>
                      <span>View All History</span>
                    </div>
                  </div>
                  
                  {scanHistory.slice(0, 3).map((scan) => (
                    <div 
                      key={scan.id}
                      className="av-history-item" 
                      onClick={() => viewScanDetails(scan)}
                    >
                      <div className={`av-status-indicator ${scan.status}`}></div>
                      <Icon src="security" width={16} />
                      <div className="av-history-content">
                        <div className="av-history-title">
                          {scan.status === "clean" ? "Scan completed successfully" : "Threats detected during scan"}
                        </div>
                        <div className="av-history-subtitle">
                          {formatDate(scan.date)} • {scan.filesScanned.toLocaleString()} files scanned
                        </div>
                      </div>
                      <Icon fafa="faChevronRight" width={12} className="av-history-arrow" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 