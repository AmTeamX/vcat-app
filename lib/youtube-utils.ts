/**
 * Video embed utilities
 * Helper functions for handling YouTube and Google Drive video URLs
 */

/**
 * Convert various YouTube URL formats to embed URL
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID (already embed format)
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;

    // Already an embed URL
    if (url.includes('/embed/')) {
        return url;
    }

    // Extract video ID from various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
        /youtube\.com\/watch\?.*v=([^&]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            const videoId = match[1];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
    }

    return null;
}

/**
 * Convert Google Drive video URL to embed format
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/preview (already embed format)
 */
export function getGoogleDriveEmbedUrl(url: string): string | null {
    if (!url) return null;

    // Already an embed/preview URL
    if (url.includes('/preview')) {
        return url;
    }

    // Extract file ID from various Google Drive URL formats
    const patterns = [
        /\/file\/d\/([^/]+)/,
        /[?&]id=([^&]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            const fileId = match[1];
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
    }

    return null;
}

/**
 * Get embed URL for any supported video platform
 * @param url - Video URL from YouTube, Google Drive, or direct video file
 * @returns Embed URL or original URL if not recognized
 */
export function getVideoEmbedUrl(url: string): string | null {
    if (!url) return null;

    if (isYouTubeUrl(url)) {
        return getYouTubeEmbedUrl(url);
    }

    if (isGoogleDriveUrl(url)) {
        return getGoogleDriveEmbedUrl(url);
    }

    // Return original URL for direct video files
    return url;
}

/**
 * Check if URL is a YouTube video
 */
export function isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Check if URL is a Google Drive video
 */
export function isGoogleDriveUrl(url: string): boolean {
    return url.includes('drive.google.com');
}

/**
 * Check if URL needs iframe embed (YouTube or Google Drive)
 */
export function needsIframeEmbed(url: string): boolean {
    return isYouTubeUrl(url) || isGoogleDriveUrl(url);
}
