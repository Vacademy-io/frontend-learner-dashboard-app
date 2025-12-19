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
      <div className={`w-full overflow-hidden rounded-lg shadow-xl ${className}`}>
        <div className="relative aspect-video bg-black">
          {/* Use Iframe Bridge for iOS to avoid Error 153 */}
          <iframe
            src={`${BRIDGE_URL}?videoId=${videoId}`}
            className="size-full rounded-lg bg-black"
            allow="autoplay; encrypted-media"
            title="YouTube video player"
          />
        </div>
      </div>
    );
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
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
};
