import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Battery from "../../components/shared/Battery";
import { Icon, Image } from "../../utils/general";
import "./back.scss";
// Import Keycloak
import Keycloak from 'keycloak-js';

// Initialize Keycloak instance
const keycloakConfig = {
  url: 'http://localhost:18080',
  realm: 'evently',
  clientId: 'evently-public-client'
};

// Create Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export const Background = () => {
  const wall = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();

  return (
    <div
      className="background"
      style={{
        backgroundImage: `url(img/wallpaper/${wall.src})`,
      }}
    ></div>
  );
};

export const BootScreen = (props) => {
  const dispatch = useDispatch();
  const wall = useSelector((state) => state.wallpaper);
  const [blackout, setBlackOut] = useState(false);

  useEffect(() => {
    if (props.dir < 0) {
      setTimeout(() => {
        setBlackOut(true);
      }, 4000);
    }
  }, [props.dir]);

  useEffect(() => {
    if (props.dir < 0) {
      if (blackout) {
        if (wall.act == "restart") {
          setTimeout(() => {
            setBlackOut(false);
            setTimeout(() => {
              dispatch({ type: "WALLBOOTED" });
            }, 4000);
          }, 2000);
        }
      }
    }
  }, [blackout]);

  return (
    <div className="bootscreen">
      <div className={blackout ? "hidden" : ""}>
        <Image src="asset/bootlogo" w={180} />
        <div className="mt-48" id="loader">
          <svg
            className="progressRing"
            height={48}
            width={48}
            viewBox="0 0 16 16"
          >
            <circle cx="8px" cy="8px" r="7px"></circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export const LockScreen = (props) => {
  const wall = useSelector((state) => state.wallpaper);
  const [unlocked, setUnLock] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [loadingScenarios, setLoadingScenarios] = useState(false);
  const dispatch = useDispatch();

  const userName = useSelector((state) => state.setting.person.name);

  // Check if user is already authenticated
  useEffect(() => {
    // Initialize Keycloak
    initKeycloak();
  }, []);

  // Fetch scenarios when the login form is shown
  useEffect(() => {
    if (showLoginForm) {
      fetchScenarios();
    }
  }, [showLoginForm]);

  // Fetch scenarios from the API
  const fetchScenarios = async () => {
    try {
      setLoadingScenarios(true);
      // Using HTTPS for security
      const response = await fetch('https://localhost:5001/story-engine/scenarios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // For development environments that might use self-signed certificates
        // In production, proper certificates should be used
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setScenarios(data);
      
      // Set the first scenario as the default if available
      if (data.length > 0) {
        setSelectedScenario(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch scenarios:", error);
      setAuthError("Failed to load scenarios. Please try again later.");
    } finally {
      setLoadingScenarios(false);
    }
  };

  // Initialize Keycloak
  const initKeycloak = async () => {
    console.log("Initializing Keycloak");
    try {
      // Try to refresh the token if user was previously logged in
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false
      });

      console.log("Keycloak initialized");

      if (authenticated) {
        console.log("Keycloak authenticated");

        // User is authenticated
        setIsAuthenticated(true);
        
        // Store tokens in localStorage
        localStorage.setItem("auth_token", keycloak.token);
        console.log("Auth token stored");
        localStorage.setItem("refresh_token", keycloak.refreshToken);
        console.log("Refresh token stored");
        localStorage.setItem("token_expiry", new Date().getTime() + (keycloak.tokenParsed.exp * 1000));
        console.log("Token expiry stored");
        
        // Auto unlock if user is already authenticated
        setUnLock(true);
        setTimeout(() => {
          dispatch({ type: "WALLUNLOCK" });
        }, 500);
        
        // Set up token refresh
        setupTokenRefresh();
      } else {
        // Check if we have tokens in localStorage
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
          // Check if token is still valid (not expired)
          const tokenExpiry = localStorage.getItem("token_expiry");
          const isValid = tokenExpiry && new Date().getTime() < parseInt(tokenExpiry);
          
          if (isValid) {
            setIsAuthenticated(true);
            // Auto unlock if user is already authenticated
            setUnLock(true);
            setTimeout(() => {
              dispatch({ type: "WALLUNLOCK" });
              // Enter fullscreen mode
              if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
                console.log("Entered fullscreen mode");
              } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
                console.log("Entered fullscreen mode (webkit)");
              } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
                console.log("Entered fullscreen mode (ms)");
              }
            }, 500);
          } else {
            // Token expired, clear it
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("token_expiry");
          }
        }
      }
    } catch (error) {
      console.error("Failed to initialize Keycloak:", error);
    }
  };

  // Set up token refresh
  const setupTokenRefresh = () => {
    // Set up token refresh interval
    setInterval(() => {
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          // Update tokens in localStorage
          localStorage.setItem("auth_token", keycloak.token);
          localStorage.setItem("refresh_token", keycloak.refreshToken);
          localStorage.setItem("token_expiry", new Date().getTime() + (keycloak.tokenParsed.exp * 1000));
          console.log('Token refreshed');
        }
      }).catch(() => {
        console.error('Failed to refresh token');
      });
    }, 60000); // Check for token refresh every minute
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!username.trim()) {
      setAuthError("Email is required");
      return;
    }
    
    if (!password.trim()) {
      setAuthError("Password is required");
      return;
    }

    if (!selectedScenario) {
      console.log("No scenario selected");
      setAuthError("Please select a scenario");
      return;
    }

    localStorage.setItem("selected_scenario", selectedScenario);
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Use Keycloak JavaScript adapter for login
      const authenticated = await keycloak.login({
        loginHint: username,
        redirectUri: window.location.origin,
        // We're not using redirectUri because we want to handle the login in our app
        // Instead, we'll use the direct grant flow (Resource Owner Password Credentials)
      });
      
      // If we get here, it means the redirect didn't happen (which is expected for direct grant)
      // So we need to manually authenticate with username and password
      
      // Prepare form data for Keycloak token request
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', 'evently-public-client');
      formData.append('scope', 'email openid');
      formData.append('username', username);
      formData.append('password', password);
      
      // Make the request to Keycloak token endpoint
      const response = await fetch('http://localhost:18080/realms/evently/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Authentication successful
        const { access_token, refresh_token, expires_in } = data;
        
        // Store tokens in localStorage
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("token_expiry", new Date().getTime() + (expires_in * 1000));
        
        // Update Keycloak instance with the new tokens
        keycloak.token = access_token;
        keycloak.refreshToken = refresh_token;
        keycloak.tokenParsed = JSON.parse(atob(access_token.split('.')[1]));
        keycloak.refreshTokenParsed = JSON.parse(atob(refresh_token.split('.')[1]));
        
        // Set up token refresh
        setupTokenRefresh();
        
        setIsAuthenticated(true);
        setUnLock(true);
        setTimeout(() => {
          dispatch({ type: "WALLUNLOCK" });
        }, 1000);
      } else {
        // Authentication failed
        setAuthError(data.error_description || "Invalid email or password");
      }
    } catch (error) {
      setAuthError("Authentication failed. Please check your connection and try again.");
      console.error("Login error:", error);
      localStorage.removeItem("selected_scenario");
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (showLoginForm) {
        handleLogin();
      } else {
        setShowLoginForm(true);
      }
    }
  };

  // Add a logout function that uses Keycloak
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    
    // Logout from Keycloak
    keycloak.logout({ redirectUri: window.location.origin });
  };

  // If already authenticated, don't show login form
  if (isAuthenticated && !unlocked) {
    return (
      <div
        className="lockscreen slowfadein"
        data-unlock={true}
        style={{
          backgroundImage: `url(${`img/wallpaper/lock.jpg`})`,
          backgroundColor: "#0066ff",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Unlocking...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={"lockscreen " + (props.dir == -1 ? "slowfadein" : "")}
      data-unlock={unlocked}
      style={{
        backgroundImage: `url(${`img/wallpaper/lock.jpg`})`,
        backgroundColor: "#0066ff", // Blue background color
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div 
        className="flex flex-col items-center justify-center h-screen w-full"
        data-unlock={unlocked}
      >
        <div className="flex flex-col items-center max-w-md w-full px-4">
          <Image
            className="rounded-full overflow-hidden mb-4"
            src="img/asset/prof.jpg"
            w={120}
            ext
          />
          <div className="mt-2 text-xl font-medium text-white">
            {userName || "PC"}
          </div>
          
          {showLoginForm ? (
            <div className="mt-6 flex flex-col items-center w-full">
              {authError && (
                <div className="mb-4 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm w-full text-center">
                  {authError}
                </div>
              )}
              
              <div className="w-full space-y-4">
                <div>
                  <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Email"
                    className="px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
                    autoFocus
                  />
                </div>
                
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Password"
                    className="px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
                  />
                </div>
                
                <div>
                  {loadingScenarios ? (
                    <div className="px-3 py-2 bg-white/10 border border-white/30 rounded text-white flex items-center justify-center">
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                      <span className="text-white/50">Loading scenarios...</span>
                    </div>
                  ) : (
                    <select
                      value={selectedScenario}
                      onChange={(e) => setSelectedScenario(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-white/50 w-full appearance-none"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                    >
                      <option value="" disabled>Select Scenario</option>
                      {scenarios.map((scenario) => (
                        <option key={scenario.id} value={scenario.id} className="bg-gray-800 text-white">
                          {scenario.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <button 
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded text-sm w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                  ) : null}
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowLoginForm(true)}
              className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded text-sm"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
