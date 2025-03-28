
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import darshanVideos from '@/data/darshan-videos.json';

const LiveDarshan = () => {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState(darshanVideos.videos[0]);

  const handleSelectVideo = (video: typeof darshanVideos.videos[0]) => {
    setSelectedVideo(video);
    toast({
      title: "Video Selected",
      description: `Now showing: ${video.title}`,
    });
  };

  return (
    <ThemeProvider>
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Live Temple Darshan</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl overflow-hidden shadow-lg mb-6">
                <div className="relative aspect-video">
                  <iframe
                    src={selectedVideo.embedUrl}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                  <p className="text-muted-foreground">{selectedVideo.description}</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">Available Darshans</h3>
              <div className="space-y-4 overflow-auto max-h-[600px] pr-2">
                {darshanVideos.videos.map((video) => (
                  <Card 
                    key={video.id}
                    className={`cursor-pointer transition-all ${video.id === selectedVideo.id ? 'border-primary' : ''}`}
                    onClick={() => handleSelectVideo(video)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-20 h-14 shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{video.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default LiveDarshan;
