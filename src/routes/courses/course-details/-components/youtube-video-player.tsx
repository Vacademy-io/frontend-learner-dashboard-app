import React from 'react';
import { isYouTubeUrl, convertToYouTubeEmbedUrl } from '../-utils/helper';

interface YouTubeVideoPlayerProps {
  url: string;
  className?: string;
}

export const YouTubeVideoPlayer: React.FC<YouTubeVideoPlayerProps> = ({ 
  url, 
  className = "" 
}) => {
  if (!url || !isYouTubeUrl(url)) {
    return null;
  }

  const embedUrl = convertToYouTubeEmbedUrl(url);

  return (
    <div className={`w-full overflow-hidden rounded-lg shadow-xl ${className}`}>
      <div className="relative aspect-video bg-black">
        <iframe
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          className="size-full rounded-lg"
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
          }}
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        />
      </div>
    </div>
  );
}; 