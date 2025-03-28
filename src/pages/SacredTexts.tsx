
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Search, ZoomIn, ZoomOut, X, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import sacredTextsData from '@/data/sacred-texts.json';

const SacredTexts = () => {
  const isMobile = useIsMobile();
  const [selectedText, setSelectedText] = useState(sacredTextsData.texts[0]);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  
  const handleSelectText = (text: typeof sacredTextsData.texts[0]) => {
    setSelectedText(text);
  };

  const PdfViewer = () => (
    <div className="w-full h-full bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsPdfOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
          <h2 className="font-medium">{selectedText.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm">1 / 42</span>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[calc(100vh-4rem)] overflow-auto">
        <iframe 
          src={`${selectedText.pdfUrl}#toolbar=0`} 
          title={selectedText.title}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );

  return (
    <ThemeProvider>
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Sacred Texts</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sacredTextsData.texts.map((text) => (
              <Card key={text.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={text.imageUrl} 
                    alt={text.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{text.title}</h3>
                  <p className="text-muted-foreground mb-4">{text.description}</p>
                  
                  {isMobile ? (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button 
                          onClick={() => {
                            handleSelectText(text);
                            setIsPdfOpen(true);
                          }}
                          className="w-full bg-white text-hindu-red hover:bg-white/90"
                        >
                          <FileText className="mr-2 h-4 w-4" /> Read Text
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="h-[85vh]">
                        <PdfViewer />
                      </DrawerContent>
                    </Drawer>
                  ) : (
                    <Dialog open={isPdfOpen && selectedText.id === text.id} onOpenChange={setIsPdfOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => {
                            handleSelectText(text);
                            setIsPdfOpen(true);
                          }}
                          className="w-full bg-white text-hindu-red hover:bg-white/90"
                        >
                          <FileText className="mr-2 h-4 w-4" /> Read Text
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-5/6 h-5/6 max-w-6xl p-0">
                        <PdfViewer />
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default SacredTexts;
