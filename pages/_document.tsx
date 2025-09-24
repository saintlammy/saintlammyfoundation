import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}