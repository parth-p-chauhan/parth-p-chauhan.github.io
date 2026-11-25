import { Head, Html, Main, NextScript } from "next/document";

import { GTM_ID, gtmInitScript } from "@/lib/analytics";

const analyticsEnabled = process.env.NODE_ENV === "production";

const themeScript =
  '(function(){var root=document.documentElement;root.classList.add("js");try{var stored=localStorage.getItem("portfolio-theme");if(stored==="light"||stored==="dark"){root.setAttribute("data-theme",stored);}}catch(e){}})();';

const yearScript =
  '(function(){var year=String(new Date().getFullYear());document.querySelectorAll("[data-year]").forEach(function(el){el.textContent=year;});})();';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta
          name="google-site-verification"
          content="lJ5DDwcdzS5tU-lz1NIXF2jhX-LlLY6_lIJG60mO25Y"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {analyticsEnabled ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
            />
            <script dangerouslySetInnerHTML={{ __html: gtmInitScript }} />
          </>
        ) : null}
      </Head>
      <body>
        {analyticsEnabled ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              sandbox=""
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        <Main />
        <script dangerouslySetInnerHTML={{ __html: yearScript }} />
        <NextScript />
      </body>
    </Html>
  );
}
