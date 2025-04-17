import React from 'react';
import { Lock } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

/**
 * Login screen component for WhatsApp
 */
const LoginScreen = ({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  handleLogin, 
  authLoading, 
  authError 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#111B21] text-gray-100">
      <div className="w-80 p-6 bg-[#202C33] rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <Lock className="h-12 w-12 text-[#00A884]" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-6">Sign in to ChatApp</h2>
        
        {authError && (
          <div className="mb-4 p-2 bg-red-900/30 border border-red-800 rounded text-red-200 text-sm">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-300">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#2A3942] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#00A884]"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#2A3942] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#00A884]"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#00A884] hover:bg-[#008f6e] text-white"
              disabled={authLoading}
            >
              {authLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen; 