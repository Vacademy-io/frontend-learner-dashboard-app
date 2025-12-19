import React from "react";

interface YouTubeEmbedPlayerProps {
    url: string;
    title?: string;
    className?: string;
}

declare global {
    interface Window {
        Capacitor?: {
            getPlatform: () => string;
        }
    }
}

// Utility: extract the 11-character YouTube ID from any common URL form
function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    const regExp =
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|live\/))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Check if URL is a YouTube URL
function isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
}

// Convert any YouTube URL to embed format with branding disabled
function convertToYouTubeEmbedUrl(url: string): string {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return url;

    // Standard embed URL for non-iOS or fallback
    const params = new URLSearchParams({
        modestbranding: '1',  // Reduce YouTube logo in controls
        rel: '0',             // Don't show related videos from other channels
        fs: '1',              // Enable fullscreen button
        playsinline: '1',     // Play inline on mobile
        iv_load_policy: '3',  // Hide video annotations
        disablekb: '1',       // Disable keyboard controls (prevents seeking via arrow keys)
        cc_load_policy: '0',  // Don't force captions
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

const BRIDGE_URL = "https://vacademy.io/player.html";

export const YouTubeEmbedPlayer: React.FC<YouTubeEmbedPlayerProps> = ({
    url,
    title = "Video",
    className = "",
}) => {
    const videoId = extractYouTubeVideoId(url);
    const isNativeIOS = typeof window !== 'undefined' &&
        window.Capacitor?.getPlatform() === 'ios';

    if (!url || !isYouTubeUrl(url)) {
        return (
            <div className="flex items-center justify-center h-[40vh] sm:h-[50vh] bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-8">
                <p className="text-white/50 text-sm sm:text-base">Invalid YouTube URL</p>
            </div>
        );
    }

    if (isNativeIOS && videoId) {
        return (
            <div className={`youtube-embed-container relative overflow-hidden rounded-lg sm:rounded-xl bg-black ${className}`}>
                <div className="relative aspect-video">
                    {/* Use Iframe Bridge for iOS to avoid Error 153 */}
                    <iframe
                        src={`${BRIDGE_URL}?videoId=${videoId}`}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="autoplay; encrypted-media"
                        title={title}
                    />
                </div>
            </div>
        );
    }

    const embedUrl = convertToYouTubeEmbedUrl(url);

    return (
        <div className={`youtube-embed-container relative overflow-hidden rounded-lg sm:rounded-xl bg-black ${className}`}>
            <div className="relative aspect-video">
                <iframe
                    src={embedUrl}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    className="w-full h-full absolute inset-0"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </div>
        </div>
    );
};

export { extractYouTubeVideoId, isYouTubeUrl, convertToYouTubeEmbedUrl };
