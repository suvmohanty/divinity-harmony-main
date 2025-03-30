import axios from 'axios';

// YouTube API key
const API_KEY = 'AIzaSyBIiIouahWt7tyfTi4Ajz29e4zQm-H3CmI';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  embedUrl: string;
  channelTitle: string;
  publishedAt: string;
  isLive: boolean;
}

/**
 * Searches for temple darshan live streams on YouTube
 */
export const searchLiveDarshans = async (query = 'temple darshan live', maxResults = 10): Promise<YouTubeVideo[]> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        eventType: 'live',
        maxResults,
        key: API_KEY,
        relevanceLanguage: 'en',
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      isLive: true,
    }));
  } catch (error) {
    console.error('Error fetching live darshans:', error);
    return [];
  }
};

/**
 * Gets videos from a specific YouTube channel
 */
export const getChannelVideos = async (channelId: string, maxResults = 10): Promise<YouTubeVideo[]> => {
  try {
    // First get the upload playlist ID for the channel
    const channelResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
      params: {
        part: 'contentDetails',
        id: channelId,
        key: API_KEY,
      },
    });

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from the uploads playlist
    const playlistResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults,
        key: API_KEY,
      },
    });

    return playlistResponse.data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      embedUrl: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      isLive: false,
    }));
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
};

/**
 * Gets details for a specific video
 */
export const getVideoDetails = async (videoId: string): Promise<YouTubeVideo | null> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'snippet,liveStreamingDetails',
        id: videoId,
        key: API_KEY,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    const item = response.data.items[0];
    const isLive = !!item.liveStreamingDetails?.actualStartTime;

    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      embedUrl: `https://www.youtube.com/embed/${item.id}${isLive ? '?autoplay=1' : ''}`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      isLive,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

/**
 * Get popular Hindu temple channels
 * This is a static list for now but could be fetched from YouTube API or a database
 */
export const getPopularTempleChannels = () => {
  return [
    // Original channels
    { id: 'UC5N3z_CvEtLARUJg7rZnHgA', name: 'Shri Siddhivinayak Temple', location: 'Mumbai' },
    { id: 'UCi1v-92aO0s-kYV8uEJ2TFQ', name: 'Varanasi Live Ganga Aarti', location: 'Varanasi' },
    { id: 'UCOXLZKOzZI-JrMBE4AmKGWQ', name: 'Tirumala Tirupati Devasthanams', location: 'Tirupati' },
    { id: 'UCv5C1-FgrEUXLmVrTl0qvFg', name: 'Shree Somnath Trust', location: 'Gujarat' },
    { id: 'UCPasF3QY3ut64Nrn8aA_alA', name: 'Sri Venkateswara Swamy Devasthanam', location: 'Tirumala' },
    { id: 'UCIC9hR1jHiwBKOI3qH1KBSQ', name: 'Kashi Vishwanath Temple', location: 'Varanasi' },
    
    // Additional temple channels
    { id: 'UCZmEb1AXXTbJn7MJnM3E3xA', name: 'ISKCON Mayapur', location: 'West Bengal' },
    { id: 'UC4vg1b1gUMux_sBtP3pZF-Q', name: 'Jagannath Temple Puri', location: 'Odisha' },
    { id: 'UCzR0jl-YhTXcEcE2ATKcFOA', name: 'Shree Padmanabhaswamy Temple', location: 'Kerala' },
    { id: 'UCYQ9IBKYZNYQIYUQzuu7WNw', name: 'Kedarnath Temple Live', location: 'Uttarakhand' },
    { id: 'UCRYPuUOChmxBpAfL8OXpFLw', name: 'Badrinath Temple', location: 'Uttarakhand' },
    { id: 'UCHFUmSDvUN8-osNlJD4uuQA', name: 'Meenakshi Temple', location: 'Madurai' },
    { id: 'UCWc6HCVs1mXwCvcnO2cKkCQ', name: 'Akshardham Temple', location: 'Delhi' },
    { id: 'UCXiwuYI3LxESWFvqLJQR5_g', name: 'ISKCON Bangalore', location: 'Karnataka' },
    { id: 'UCPGDHhn2yx4_YHqzBkbg2lA', name: 'Sai Baba Shirdi Sansthan', location: 'Maharashtra' },
    { id: 'UCbMQg5MDZOi8-XiRUrzTsOw', name: 'Shree Kashi Vishwanath', location: 'Varanasi' },
    { id: 'UC85YS9iYPxfmHm0XcR_6nTg', name: 'Mahakaleshwar Temple', location: 'Ujjain' },
    { id: 'UCUBnEusmPbm3nRSBWeQnwkw', name: 'Kamakhya Temple', location: 'Assam' },
    { id: 'UCm-lNeBFXb3zKWfYYcG15bQ', name: 'Rameshwaram Temple', location: 'Tamil Nadu' },
    { id: 'UC9fLpUuT7i4s_TjFpWTuqJA', name: 'Kanchipuram Temples', location: 'Tamil Nadu' },
    { id: 'UC6BX-hKE1jKm-VyfAScVPLA', name: 'Sri Krishna Matha', location: 'Udupi' },
    { id: 'UCb0q4LkzXPR3q4Rk9RQ-GxA', name: 'Brahma Temple', location: 'Pushkar' },
    { id: 'UCD54BjM9HUweGSbVvq7kXAA', name: 'Brihadeeswarar Temple', location: 'Thanjavur' },
    { id: 'UCmEYysYxHLPz1Y8XDsLcL-g', name: 'Dakshineshwar Kali Temple', location: 'Kolkata' },
    { id: 'UCnkxPx6awLgVhMKrAG9eobA', name: 'Ramanathaswamy Temple', location: 'Rameshwaram' },
    
    // International Hindu temples
    { id: 'UCPWBhJNHf7LZjUzCKkmSX5w', name: 'BAPS Swaminarayan Mandir', location: 'London, UK' },
    { id: 'UCQCvVpj5kSHDlIzHGO8shKQ', name: 'Sri Venkateswara Temple', location: 'Pittsburgh, USA' },
    { id: 'UCCPtdKGdMNzkiG94H_CfttA', name: 'Sri Siva Vishnu Temple', location: 'Maryland, USA' },
    { id: 'UC_mcZFtG5OkEqR0ViJZx5uw', name: 'Shri Lakshmi Narayan Mandir', location: 'Toronto, Canada' },
    { id: 'UCF_n0CZiICgGCDQKs84BnXQ', name: 'Murugan Temple', location: 'Sydney, Australia' },
    { id: 'UCZKGgbCp1Mya47XZrk21mXQ', name: 'ISKCON Melbourne', location: 'Australia' },
  ];
};

/**
 * Searches for live temple darshan feeds using multiple queries
 * This helps find more varied live streams from different temples
 */
export const getFeatureLiveDarshans = async (maxResults = 20): Promise<YouTubeVideo[]> => {
  // Search queries focused on different temple ceremonies and rituals
  const searchQueries = [
    'temple darshan live',
    'aarti live ceremony hindu',
    'hindu temple puja live',
    'ganga aarti varanasi live',
    'tirupati balaji darshan live',
    'kedarnath temple live',
    'hindu temple abhishekam live',
    'temple procession live',
    'temple festival live hindu',
    'mandir live darshan'
  ];
  
  try {
    // Run all searches in parallel
    const searchPromises = searchQueries.map(query => 
      searchLiveDarshans(query, Math.ceil(maxResults / searchQueries.length))
    );
    
    const results = await Promise.all(searchPromises);
    
    // Combine all results and remove duplicates (by video ID)
    const allVideos = results.flat();
    const uniqueVideos: YouTubeVideo[] = [];
    const videoIds = new Set<string>();
    
    for (const video of allVideos) {
      if (!videoIds.has(video.id)) {
        videoIds.add(video.id);
        uniqueVideos.push(video);
      }
    }
    
    // Return the requested number of results (or all unique results if less)
    return uniqueVideos.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching featured live darshans:', error);
    return [];
  }
}; 