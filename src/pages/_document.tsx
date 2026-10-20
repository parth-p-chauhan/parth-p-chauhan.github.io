import { Head, Html, Main, NextScript } from "next/document";

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
      </Head>
      <body>
        <Main />
        <script dangerouslySetInnerHTML={{ __html: yearScript }} />
        <NextScript />
      </body>
    </Html>
  );
}
