/**
 * Search Terms Mapping for Searchly
 * 
 * This mapping links search terms (case-insensitive) to their corresponding
 * target URLs within the game's internal DNS system.
 * 
 * Format:
 * "search term": "target-url.com"
 * 
 * Notes:
 * - Search terms should be lowercase for proper matching
 * - Ensure target URLs exist in the internalDNS.jsx registry
 * - You can add aliases (multiple search terms pointing to the same URL)
 */

const searchTermsMapping = {
  // News and social related
  "alex freeman": "buzzhub.com",
  "alex freeman news": "buzzhub.com",
  "alex freeman article": "buzzhub.com",
  "buzzhub": "buzzhub.com",
  "news": "buzzhub.com",
  "quickbite": "quickbite.com",
  "social media": "quickbite.com",

  // Tools and utilities
  "exif": "exif-guide.com",
  "exif data": "exif-guide.com",
  "exif metadata": "exif-guide.com",
  "exif tool": "localhost/exiftool",
  "exiftool": "localhost/exiftool",
  "metadata tool": "localhost/exiftool",
  "metadata extraction": "localhost/exiftool",
  "exif hiding": "techxplorer.com/forums/exif-hiding",
  "hide metadata": "techxplorer.com/forums/exif-hiding",
  "audio editing": "audio-guide.com",
  "audio guide": "audio-guide.com",

  // Communication
  "checkmail": "secmail.com",
  "secure mail": "secmail.com",
  "email": "secmail.com",
  "mail": "secmail.com",
  "chat": "www.silent.com/room-01",
  "silent chat": "www.silent.com/room-01",
  "secure chat": "www.silent.com/room-01",
  "encrypted chat": "www.silent.com/room-01",

  // Investigation related
  "how to find someone geolocation": "exif-guide.com",
  "location from photo": "exif-guide.com",
  "gps from image": "exif-guide.com",
  "find location": "exif-guide.com",
  "tattoo": "buzzhub.com",
  "tattoo identification": "buzzhub.com",
  "identify tattoo": "buzzhub.com"
};

export default searchTermsMapping; 