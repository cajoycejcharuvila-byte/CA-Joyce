// Google Analytics 4 — only injected in production builds
// Set NEXT_PUBLIC_GA_ID in your .env.local and Vercel env vars
// e.g. NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { page_path: window.location.pathname });
          `,
        }}
      />
    </>
  );
}
