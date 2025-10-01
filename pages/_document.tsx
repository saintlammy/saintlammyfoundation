import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* SEO Meta Tags */}
        <meta charSet="utf-8" />

        {/* Primary Meta Tags */}
        <meta name="title" content="Saintlammy Foundation - Empowering Widows, Orphans & Vulnerable Communities in Nigeria" />
        <meta name="description" content="Hope Has a Home. Join Saintlammy Foundation in building a future where no widow is forgotten, no orphan left behind. Supporting vulnerable communities across Nigeria with love, structure, and action." />
        <meta name="keywords" content="Nigeria charity, orphan care, widow empowerment, community development, charitable foundation, nonprofit organization, vulnerable families, social impact" />
        <meta name="author" content="Saintlammy Foundation" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://saintlammyfoundation.org/" />
        <meta property="og:title" content="Saintlammy Foundation - Empowering Widows, Orphans & Vulnerable Communities" />
        <meta property="og:description" content="Hope Has a Home. Join us in building a future where no widow is forgotten, no orphan left behind. Supporting vulnerable communities across Nigeria." />
        <meta property="og:image" content="https://saintlammyfoundation.org/og-image.jpg" />
        <meta property="og:site_name" content="Saintlammy Foundation" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://saintlammyfoundation.org/" />
        <meta property="twitter:title" content="Saintlammy Foundation - Empowering Widows, Orphans & Vulnerable Communities" />
        <meta property="twitter:description" content="Hope Has a Home. Join us in building a future where no widow is forgotten, no orphan left behind." />
        <meta property="twitter:image" content="https://saintlammyfoundation.org/og-image.jpg" />

        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4f46e5" />

        {/* Performance & SEO */}
        <link rel="canonical" href="https://saintlammyfoundation.org/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              "name": "Saintlammy Foundation",
              "alternateName": "Saintlammy Community Care Initiative",
              "url": "https://saintlammyfoundation.org",
              "logo": "https://saintlammyfoundation.org/logo.png",
              "description": "A Nigerian charitable foundation empowering widows, orphans, and vulnerable communities through love, structure, and action.",
              "foundingDate": "2022",
              "founders": [
                {
                  "@type": "Person",
                  "name": "Saintlammy"
                }
              ],
              "areaServed": {
                "@type": "Country",
                "name": "Nigeria"
              },
              "mission": "Building a future where no widow is forgotten, no orphan left behind, and no vulnerable home stands alone.",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+234-123-456-7890",
                "contactType": "customer service",
                "email": "info@saintlammyfoundation.org"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Nigeria"
              },
              "sameAs": [
                "https://facebook.com/saintlammyfoundation",
                "https://twitter.com/saintlammyfnd",
                "https://instagram.com/saintlammyfoundation"
              ]
            })
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://db.onlinewebfonts.com/c/94f8c3b3e75e90b4c374c2d0f88e5ce1?family=Sohne');
            @font-face {
              font-family: "Söhne";
              src: url("https://db.onlinewebfonts.com/t/94f8c3b3e75e90b4c374c2d0f88e5ce1.eot");
              src: url("https://db.onlinewebfonts.com/t/94f8c3b3e75e90b4c374c2d0f88e5ce1.eot?#iefix") format("embedded-opentype"),
                   url("https://db.onlinewebfonts.com/t/94f8c3b3e75e90b4c374c2d0f88e5ce1.woff2") format("woff2"),
                   url("https://db.onlinewebfonts.com/t/94f8c3b3e75e90b4c374c2d0f88e5ce1.woff") format("woff"),
                   url("https://db.onlinewebfonts.com/t/94f8c3b3e75e90b4c374c2d0f88e5ce1.ttf") format("truetype"),
                   url("https://db.onlinewebfonts.com/t/94f8c3b3e75e90b4c374c2d0f88e5ce1.svg#Söhne") format("svg");
            }

            /* OpenAI-style animated gradient */
            @keyframes gradient-shift {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }

            .openai-gradient-text {
              background: linear-gradient(
                90deg,
                #ff6b6b,
                #4ecdc4,
                #45b7d1,
                #96ceb4,
                #ffeaa7,
                #dda0dd,
                #ff9ff3,
                #54a0ff,
                #5f27cd
              );
              background-size: 300% 300%;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: gradient-shift 15s ease infinite;
            }

            .openai-gradient-border {
              position: relative;
              border: 2px solid transparent;
              background: linear-gradient(rgb(17, 24, 39), rgb(17, 24, 39)) padding-box,
                         linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd, #ff9ff3, #54a0ff, #5f27cd) border-box;
              background-size: 100% 100%, 300% 300%;
              animation: 0s, gradient-shift 8s ease infinite;
              border-radius: 1rem;
            }

            /* Professional Linear Gradient Backgrounds */
            .professional-gradient-1 {
              background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
              background-size: 400% 400%;
              animation: professional-gradient-shift 12s ease infinite;
              border-radius: 1rem;
            }

            .professional-gradient-2 {
              background: linear-gradient(45deg, #4facfe, #00f2fe, #43e97b, #38f9d7);
              background-size: 400% 400%;
              animation: professional-gradient-shift 15s ease infinite;
              border-radius: 1rem;
            }

            .professional-gradient-3 {
              background: linear-gradient(-45deg, #fa709a, #fee140, #ffd89b, #19547b);
              background-size: 400% 400%;
              animation: professional-gradient-shift 13s ease infinite;
              border-radius: 1rem;
            }

            .professional-gradient-4 {
              background: linear-gradient(60deg, #3b82f6, #8b5cf6, #d946ef, #f59e0b);
              background-size: 400% 400%;
              animation: professional-gradient-shift 14s ease infinite;
              border-radius: 1rem;
            }

            .professional-gradient-step1 {
              background: linear-gradient(120deg, #667eea, #764ba2, #f093fb);
              background-size: 400% 400%;
              animation: professional-gradient-shift 16s ease infinite;
              border-radius: 1.5rem;
            }

            .professional-gradient-step2 {
              background: linear-gradient(-120deg, #4facfe, #00f2fe, #43e97b);
              background-size: 400% 400%;
              animation: professional-gradient-shift 18s ease infinite;
              border-radius: 1.5rem;
            }

            .professional-gradient-step3 {
              background: linear-gradient(45deg, #fa709a, #fee140, #ffd89b);
              background-size: 400% 400%;
              animation: professional-gradient-shift 14s ease infinite;
              border-radius: 1.5rem;
            }

            /* Professional Animation Keyframes */
            @keyframes professional-gradient-shift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }

            /* Accessibility: Respect user's motion preferences */
            @media (prefers-reduced-motion: reduce) {
              .openai-gradient-text,
              .professional-gradient-1,
              .professional-gradient-2,
              .professional-gradient-3,
              .professional-gradient-4,
              .professional-gradient-step1,
              .professional-gradient-step2,
              .professional-gradient-step3 {
                animation: none;
              }

              .animate-bounce,
              .animate-pulse,
              .animate-slide-up {
                animation: none;
              }
            }
          `
        }} />
      </Head>
      <body>
        {/* Prevent theme flash on page load - runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('saintlammy-theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}