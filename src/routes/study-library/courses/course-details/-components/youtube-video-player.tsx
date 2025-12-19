import React from 'react';
import { isYouTubeUrl, convertToYouTubeEmbedUrl, getYouTubeVideoId } from '../-utils/helper';

interface YouTubeVideoPlayerProps {
  url: string;
  className?: string;
}

const BRIDGE_URL = "https://vacademy.io/player.html";

export const YouTubeVideoPlayer: React.FC<YouTubeVideoPlayerProps> = ({
  url,
  className = ""
}) => {
  const videoId = getYouTubeVideoId(url);
  const isNativeIOS = typeof window !== 'undefined' &&
    window.Capacitor?.getPlatform() === 'ios';

  if (!url || !isYouTubeUrl(url)) {
    return null;
  }

  if (isNativeIOS && videoId) {
    return (
      <div className={`relative overflow-hidden rounded-md shadow-md border border-black/10 bg-black/20 group ${className}`}>
        <div className="relative aspect-video">
          {/* Use Iframe Bridge for iOS to avoid Error 153 */}
          <iframe
            src={`${BRIDGE_URL}?videoId=${videoId}`}
            className="w-full h-full object-cover rounded-md bg-black"
            allow="autoplay; encrypted-media"
            title="YouTube video player"
          />
        </div>
        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-md"></div>
      </div>
    );
  }

  const embedUrl = convertToYouTubeEmbedUrl(url);

  return (
    <div className={`relative overflow-hidden rounded-md shadow-md border border-black/10 bg-black/20 group ${className}`}>
      <div className="relative aspect-video">
        <iframe
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full object-cover rounded-md"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {/* Video overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-md"></div>
    </div>
  );
};