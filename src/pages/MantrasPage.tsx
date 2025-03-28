
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import AudioPlayer from '@/components/player/AudioPlayer';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import mantrasData from '@/data/mantras.json';
import { useToast } from "@/hooks/use-toast";

const MantrasPage = () => {
  const { toast } = useToast();
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);
  const currentMantra = mantrasData.mantras[currentMantraIndex];

  const handleNext = () => {
    if (currentMantraIndex < mantrasData.mantras.length - 1) {
      setCurrentMantraIndex(currentMantraIndex + 1);
    } else {
      toast({
        title: "End of playlist",
        description: "You've reached the end of the mantras playlist.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentMantraIndex > 0) {
      setCurrentMantraIndex(currentMantraIndex - 1);
    } else {
      toast({
        title: "Start of playlist",
        description: "You're at the beginning of the mantras playlist.",
      });
    }
  };

  const selectMantra = (index: number) => {
    setCurrentMantraIndex(index);
  };

  return (
    <ThemeProvider>
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Sacred Mantras</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl overflow-hidden shadow-lg mb-6">
                <div className="relative aspect-video">
                  <img 
                    src={currentMantra.imageUrl} 
                    alt={currentMantra.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{currentMantra.title}</h2>
                  <p className="text-muted-foreground mb-4">{currentMantra.description}</p>
                  
                  <div className="mantra-text text-lg mb-6 bg-muted/50 p-4 rounded-lg text-center">
                    {currentMantra.text}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <strong>Translation:</strong> {currentMantra.translation}
                  </div>
                </div>
              </div>
              
              <AudioPlayer 
                audioUrl={currentMantra.audioUrl}
                title={currentMantra.title}
                onNext={handleNext}
                onPrevious={handlePrevious}
                hasNext={currentMantraIndex < mantrasData.mantras.length - 1}
                hasPrevious={currentMantraIndex > 0}
              />
            </div>
            
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">Mantra Library</h3>
              <div className="space-y-4 overflow-auto max-h-[600px] pr-2">
                {mantrasData.mantras.map((mantra, index) => (
                  <Card 
                    key={mantra.id}
                    className={`cursor-pointer transition-all ${index === currentMantraIndex ? 'border-primary' : ''}`}
                    onClick={() => selectMantra(index)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={mantra.imageUrl} 
                          alt={mantra.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{mantra.title}</CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {mantra.description}
                        </CardDescription>
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

export default MantrasPage;
