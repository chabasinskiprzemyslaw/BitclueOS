import React from 'react';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from "../../../../components/ui/button";

const MediaViewer = ({ media, onClose }) => {
  const [scale, setScale] = React.useState(1);
  const isImage = media?.contentType?.startsWith('image/');
  const isVideo = media?.contentType?.startsWith('video/');

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
          <h3 className="text-lg font-semibold">{media.fileName}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isImage && (
            <>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-5 w-5 text-white" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>

      {/* Media Content */}
      <div className="max-h-[90vh] max-w-[90vw] relative">
        {isImage ? (
          <img
            src={media.fileUrl}
            alt={media.fileName}
            className="max-h-[90vh] max-w-[90vw] object-contain transition-transform"
            style={{ transform: `scale(${scale})` }}
          />
        ) : isVideo ? (
          <video
            src={media.fileUrl}
            controls
            className="max-h-[90vh] max-w-[90vw]"
          />
        ) : null}
      </div>
    </div>
  );
};

export default MediaViewer; 