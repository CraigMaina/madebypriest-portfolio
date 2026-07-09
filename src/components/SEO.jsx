import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SITE_URL = 'https://madebypriest.vercel.app';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`; // 1200x630 — supply real asset

const SEO = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <html lang="en" />
        <title>Made by Priest — Cinematic Video Editing for Brands &amp; Creators</title>
        <meta
          name="description"
          content="Cinematic video editing for brands, agencies, and creators. I turn raw footage into scroll-stopping ads and story-driven films people remember."
        />
        <meta name="author" content="Made by Priest" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#0A0A0B" />
        <link rel="canonical" href={`${SITE_URL}/`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Made by Priest" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:title" content="Made by Priest — Videos That Feel Like Blockbusters" />
        <meta
          property="og:description"
          content="Cinematic editing that turns brands into icons and viewers into fans. Scroll-stopping ads and story-driven films for brands, agencies, and creators."
        />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Made by Priest — cinematic video editing" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Made by Priest — Videos That Feel Like Blockbusters" />
        <meta
          name="twitter:description"
          content="Cinematic editing that turns brands into icons and viewers into fans. Scroll-stopping ads and story-driven films for brands, agencies, and creators."
        />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
    </HelmetProvider>
  );
};

export default SEO;
