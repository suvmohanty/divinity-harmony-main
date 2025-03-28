
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/home/HeroBanner';
import FeatureTiles from '@/components/home/FeatureTiles';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { ThemeProvider } from '@/hooks/use-theme';

const Index = () => {
  return (
    <ThemeProvider>
      <Layout>
        <HeroBanner />
        <FeaturedCarousel />
        <FeatureTiles />
      </Layout>
    </ThemeProvider>
  );
};

export default Index;
