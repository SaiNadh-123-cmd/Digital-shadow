import { useEffect, useState } from "react";

export function AdBanner({ slot, position = "sidebar", layoutKey = null, format = "auto" }) {
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    try {
      // Simple adblock check
      const adCheck = document.createElement("div");
      adCheck.className = "adsbox";
      document.body.appendChild(adCheck);
      if (adCheck.offsetHeight === 0) {
        setAdBlocked(true);
      }
      document.body.removeChild(adCheck);

      if (!adBlocked) {
        const scriptId = "adsense-script";
        if (!document.getElementById(scriptId)) {
          const script = document.createElement("script");
          script.id = scriptId;
          script.async = true;
          script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
          script.setAttribute("crossorigin", "anonymous");
          script.setAttribute("data-ad-client", "ca-pub-5224273312267357");
          document.head.appendChild(script);
        }

        // Push ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      setAdBlocked(true);
    }
  }, [adBlocked]);

  const minHeight = position === "sidebar" ? "250px" : "90px";

  if (adBlocked) {
    return (
      <div className={`bg-green-950/20 border border-green-900/40 rounded-lg p-4 font-mono w-full ${position === 'feed' ? 'my-4' : ''}`} style={position === 'feed' ? {} : { minHeight }}>
        <div className="text-yellow-400 text-xs font-bold mb-2">
          [RECOMMENDATION] Your scan revealed you have no VPN. Protect yourself:
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a
            href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=YOUR_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 hover:underline"
          >
            → NordVPN — Best overall
          </a>
          <a
            href="https://www.expressvpn.com/order"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 hover:underline"
          >
            → ExpressVPN — Fastest speeds
          </a>
          <a
            href="https://mullvad.net/en/account/create"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 hover:underline"
          >
            → Mullvad — Maximum privacy
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative flex flex-col items-center ${position === 'feed' ? 'my-6' : 'my-2'}`}>
      <div className="text-[10px] text-green-700/50 uppercase tracking-widest mb-1 w-full text-center">
        - Advertisement -
      </div>
      <div 
        className="bg-green-950/10 rounded-lg p-2 border border-green-900/20 w-full overflow-hidden flex justify-center" 
        style={position === 'feed' ? {} : { minHeight, minWidth: position === "sidebar" ? "300px" : "100%" }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-format={format}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
          data-full-width-responsive="true"
          data-ad-client="ca-pub-5224273312267357"
          data-ad-slot={slot || "9763007230"}
        />
      </div>
    </div>
  );
}
