import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SEO = () => {
  return (
    <HelmetProvider>
      <Helmet>
        {/* Title: Targets both "Cinematic" (High-End) and "Social" (Creators/Ads) */}
        <title>MadeByPriest | Cinematic Social Content & Performance Creative</title>
        
        {/* Description: Focuses on "Attention," "Ads," and "Quality" */}
        <meta name="description" content="I turn raw footage into high-performing video ads and cinematic social content. Remote video editor for brands, agencies, and creators who need scroll-stopping visuals." />
        
        {/* Keywords: Mixed bag of High-End terms and Social Media terms */}
        <meta name="keywords" content="
          Instagram Reels Editor, 
          TikTok Video Ads, 
          Performance Creative, 
          Social Media Video Production,
          Remote Video Editor, 
          VFX for Social Media, 
          Content Creator Editor,
          Direct Response Video,
          High-End Reels,
          Cinematic Vlogs
        " />
        
        <meta name="author" content="MadeByPriest" />
        
        {/* Open Graph */}
        <meta property="og:title" content="MadeByPriest | Videos That Stop The Scroll" />
        <meta property="og:description" content="Premium editing for brands and creators. Turn your content into a blockbuster." />
        <meta property="og:image" content="https://madebypriest.vercel.app/og-image.jpg" />
        <meta property="og:url" content="https://madebypriest.vercel.app/" />
        <meta property="og:type" content="website" />
      </Helmet>
    </HelmetProvider>
  );
};

export default SEO;