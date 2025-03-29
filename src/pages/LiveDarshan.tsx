import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { 
  searchLiveDarshans, 
  getChannelVideos, 
  getPopularTempleChannels, 
  getFeatureLiveDarshans,
  YouTubeVideo 
} from '@/services/youtube';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCcw, Star } from 'lucide-react';

export default function LiveDarshan() {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [liveVideos, setLiveVideos] = useState<YouTubeVideo[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<YouTubeVideo[]>([]);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  
  const templeChannels = getPopularTempleChannels();

  useEffect(() => {
    fetchFeaturedVideos();
    fetchLiveVideos();
  }, []);

  useEffect(() => {
    if (selectedChannelId) {
      fetchChannelVideos(selectedChannelId);
    }
  }, [selectedChannelId]);

  const fetchFeaturedVideos = async () => {
    setFeaturedLoading(true);
    try {
      const videos = await getFeatureLiveDarshans(20);
      setFeaturedVideos(videos);
      
      // Auto-select first video if none selected
      if (!selectedVideo && videos.length > 0) {
        setSelectedVideo(videos[0]);
        toast({
          title: "Featured Stream Started",
          description: `Now playing: ${videos[0].title}`,
        });
      }
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      toast({
        title: "Error",
        description: "Failed to load featured darshan streams. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setFeaturedLoading(false);
    }
  };

  const fetchLiveVideos = async () => {
    setIsLoading(true);
    try {
      const videos = await searchLiveDarshans();
      setLiveVideos(videos);
      
      // Auto-select first video if none selected and no featured videos
      if (!selectedVideo && featuredVideos.length === 0 && videos.length > 0) {
        setSelectedVideo(videos[0]);
        toast({
          title: "Live Stream Started",
          description: `Now playing: ${videos[0].title}`,
        });
      }
    } catch (error) {
      console.error('Error fetching live videos:', error);
      toast({
        title: "Error",
        description: "Failed to load live darshan streams. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChannelVideos = async (channelId: string) => {
    setIsLoading(true);
    try {
      const videos = await getChannelVideos(channelId);
      setChannelVideos(videos);
      
      // Auto-select first video if available
      if (videos.length > 0) {
        setSelectedVideo(videos[0]);
        toast({
          title: "Video Selected",
          description: `Now playing: ${videos[0].title}`,
        });
      }
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      toast({
        title: "Error",
        description: "Failed to load temple videos. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    toast({
      title: video.isLive ? "Live Stream Started" : "Video Selected",
      description: `Now playing: ${video.title}`,
    });
  };

  const handleRefresh = () => {
    if (activeTab === 'live') {
      fetchLiveVideos();
    } else if (activeTab === 'featured') {
      fetchFeaturedVideos();
    } else if (selectedChannelId) {
      fetchChannelVideos(selectedChannelId);
    }
  };

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setActiveTab('channels');
  };

  return (
    <ThemeProvider>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Live Temple Darshan</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {selectedVideo ? (
                <div className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 mb-4">
                  <div className="aspect-video">
                    <iframe
                      src={selectedVideo.embedUrl}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
                      {selectedVideo.isLive && (
                        <Badge variant="destructive" className="ml-2">LIVE</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {selectedVideo.channelTitle}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedVideo.description?.length > 150 
                        ? `${selectedVideo.description.substring(0, 150)}...` 
                        : selectedVideo.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
                  {isLoading || featuredLoading ? (
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  ) : (
                    <p className="text-xl text-gray-500 dark:text-gray-400">Select a video to start watching</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Temple Darshan Videos</h3>
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading || featuredLoading}>
                    {(isLoading || featuredLoading) ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                  </Button>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="featured" className="flex-1">
                      <Star className="h-3.5 w-3.5 mr-1" />
                      Featured
                    </TabsTrigger>
                    <TabsTrigger value="live" className="flex-1">Live Now</TabsTrigger>
                    <TabsTrigger value="channels" className="flex-1">Temples</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="featured" className="space-y-0 mt-0">
                    {featuredLoading ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : featuredVideos.length > 0 ? (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {featuredVideos.map((video) => (
                          <div 
                            key={video.id}
                            className={`flex items-start space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                              selectedVideo?.id === video.id 
                                ? 'bg-primary/10 border border-primary/20' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleSelectVideo(video)}
                          >
                            <div className="relative flex-shrink-0">
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title} 
                                className="w-24 h-16 object-cover rounded"
                              />
                              {video.isLive && (
                                <Badge 
                                  variant="destructive" 
                                  className="absolute top-1 right-1 text-xs px-1 py-0"
                                >
                                  LIVE
                                </Badge>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{video.channelTitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No featured darshan streams found</p>
                        <Button variant="outline" size="sm" onClick={fetchFeaturedVideos} className="mt-2">
                          Try Again
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="live" className="space-y-0 mt-0">
                    {isLoading && activeTab === 'live' ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : liveVideos.length > 0 ? (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {liveVideos.map((video) => (
                          <div 
                            key={video.id}
                            className={`flex items-start space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                              selectedVideo?.id === video.id 
                                ? 'bg-primary/10 border border-primary/20' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleSelectVideo(video)}
                          >
                            <div className="relative flex-shrink-0">
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title} 
                                className="w-24 h-16 object-cover rounded"
                              />
                              <Badge 
                                variant="destructive" 
                                className="absolute top-1 right-1 text-xs px-1 py-0"
                              >
                                LIVE
                              </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{video.channelTitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No live darshan streams found</p>
                        <Button variant="outline" size="sm" onClick={fetchLiveVideos} className="mt-2">
                          Try Again
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="channels" className="space-y-0 mt-0">
                    {!selectedChannelId ? (
                      <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-1">
                        <div className="mb-2">
                          <h4 className="text-sm font-medium mb-1 text-muted-foreground">India</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {templeChannels.slice(0, 20).map((channel) => (
                              <Button
                                key={channel.id}
                                variant="outline"
                                size="sm"
                                className="justify-start h-auto py-2 px-3 text-left"
                                onClick={() => handleSelectChannel(channel.id)}
                              >
                                <div>
                                  <div className="font-medium text-xs">{channel.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{channel.location}</div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1 text-muted-foreground">International</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {templeChannels.slice(20).map((channel) => (
                              <Button
                                key={channel.id}
                                variant="outline"
                                size="sm"
                                className="justify-start h-auto py-2 px-3 text-left"
                                onClick={() => handleSelectChannel(channel.id)}
                              >
                                <div>
                                  <div className="font-medium text-xs">{channel.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{channel.location}</div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isLoading ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : channelVideos.length > 0 ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mb-3"
                          onClick={() => setSelectedChannelId(null)}
                        >
                          ← Back to Channels
                        </Button>
                        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                          {channelVideos.map((video) => (
                            <div 
                              key={video.id}
                              className={`flex items-start space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                                selectedVideo?.id === video.id 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                              onClick={() => handleSelectVideo(video)}
                            >
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title} 
                                className="w-24 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {new Date(video.publishedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No videos found for this channel</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => fetchChannelVideos(selectedChannelId)}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
}
