import { useState, useEffect } from "react"
import { Grid } from "lucide-react"
import { saveBrowserHistory } from "./internalDNS"
import searchTermsMapping from "../../data/searchTermsMapping"

// Define suggested search terms for the dropdown
const EXAMPLE_TERMS = [
  "Alex Freeman News",
  "Exif",
  "Checkmail",
  "how to find someone geolocation",
  "tattoo",
  "encrypted chat"
]

export default function GoogleClone() {
  const [inputFocused, setInputFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [noResults, setNoResults] = useState(false)

  // Create a custom event for browser navigation
  const navigateTo = (url) => {
    // This custom event will be captured by the Chrome component
    const navigationEvent = new CustomEvent('browserNavigate', { 
      detail: { url } 
    });
    window.dispatchEvent(navigationEvent);
    
    // Also save to browser history
    saveBrowserHistory(url);
  }

  const handleSearch = () => {
    // Normalize the search query (convert to lowercase and trim)
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    // Check if the normalized query exists in the mapping
    const targetUrl = searchTermsMapping[normalizedQuery];
    
    if (targetUrl) {
      // Navigate to the target URL using our custom navigation function
      navigateTo(targetUrl);
      setNoResults(false);
    } else {
      // Display "no results" message
      setNoResults(true);
    }
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    // Clear no results message when input changes
    if (noResults) {
      setNoResults(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  const handleSuggestionClick = (term) => {
    setSearchQuery(term);
    setInputFocused(false);
    handleSearch();
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-end items-center gap-4">
        <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">AF</button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center gap-6 -mt-20">
        <h1 className="text-5xl font-bold text-blue-600">Searchly</h1>

        <div className="w-full max-w-[584px] relative">
          <div className="relative">
            <input
              type="text"
              className="w-full bg-gray-100 border border-gray-300 rounded-full py-3 px-8 focus:outline-none focus:border-blue-500 hover:border-gray-400 shadow-sm text-lg"
              placeholder="Search the web"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setTimeout(() => setInputFocused(false), 100)}
            />
            {/* Example search terms */}
            {inputFocused && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-6 flex flex-col gap-4">
                {EXAMPLE_TERMS.map((term, idx) => (
                  <div 
                    key={idx} 
                    className="text-2xl font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    {term}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* No results message */}
          {noResults && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-red-500 font-semibold">No relevant results found for "{searchQuery}".</p>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
              onClick={handleSearch}
            >
              Searchly Search
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

