import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://madebypriest.vercel.app';

const DEFAULTS = {
  title: 'Made by Priest — Cinematic Video Editing for Brands & Creators',
  description:
    'Cinematic video editing for brands, agencies, and creators. I turn raw footage into scroll-stopping ads and story-driven films people remember.',
  image: `${SITE_URL}/og-image.jpg`,
  path: '/',
  type: 'website',
};

const SEO = ({ title, description, image, path, type } = {}) => {
  const metaTitle = title || DEFAULTS.title;
  const metaDescription = description || DEFAULTS.description;
  const metaImage = image || DEFAULTS.image;
  const url = `${SITE_URL}${path || DEFAULTS.path}`;

  return (
    <Helmet>
      <html lang="en" />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="author" content="Made by Priest" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#0A0A0B" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type || DEFAULTS.type} />
      <meta property="og:site_name" content="Made by Priest" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Made by Priest — cinematic video editing" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
