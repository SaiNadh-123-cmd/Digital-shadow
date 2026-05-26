import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { useState } from "react";

export function ShareCard({ ipData, fingerprint, score }) {
  const [capturing, setCapturing] = useState(false);

  const handleShare = async () => {
    setCapturing(true);
    const element = document.getElementById("share-card-content");
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#000",
        scale: 2, // Higher resolution
      });
      
      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `digital-shadow-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      // Open Twitter intent
      const tweetText = `I just ran my Digital Shadow scan. My privacy score is ${score}/100. Websites can see WAY more than you think 👁️ ${encodeURIComponent("https://digitalshadow.app")}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&hashtags=DigitalShadow,Privacy`;
      window.open(twitterUrl, "_blank");
      
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="mt-8">
      {/* Invisible container to hold the card for capturing without messing up layout too much, or we just render it visibly but constrained */}
      <div className="overflow-x-auto pb-4">
        <div 
          id="share-card-content" 
          className="bg-black border-2 border-green-500 rounded-2xl p-6 font-mono w-[600px] shrink-0"
        >
          <div className="text-green-500 text-2xl font-bold mb-1">DIGITAL SHADOW REPORT</div>
          <div className="text-green-700 text-xs mb-6">Generated on: {new Date().toLocaleString()}</div>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
            <div>
              <div className="text-green-700 text-xs uppercase mb-1">Public IP</div>
              <div className="text-white text-lg font-bold">{ipData?.ip || "Scanning..."}</div>
            </div>
            <div>
              <div className="text-green-700 text-xs uppercase mb-1">Location</div>
              <div className="text-white text-lg font-bold">{ipData ? `${ipData.city}, ${ipData.country_code}` : "Scanning..."}</div>
            </div>
            <div>
              <div className="text-green-700 text-xs uppercase mb-1">Screen</div>
              <div className="text-white text-lg font-bold">{fingerprint?.screen ? `${fingerprint.screen.width}x${fingerprint.screen.height}` : "..."}</div>
            </div>
            <div>
              <div className="text-green-700 text-xs uppercase mb-1">CPU Cores</div>
              <div className="text-white text-lg font-bold">{fingerprint?.cpu?.cores || "..."}</div>
            </div>
            <div>
              <div className="text-green-700 text-xs uppercase mb-1">Canvas Hash</div>
              <div className="text-red-400 text-sm font-bold break-all">{fingerprint?.canvasHash || "..."}</div>
            </div>
            <div>
              <div className="text-green-700 text-xs uppercase mb-1">Privacy Score</div>
              <div className="text-yellow-400 text-2xl font-bold">{score !== undefined ? `${score}/100` : "..."}</div>
            </div>
          </div>
          
          <div className="border-t border-green-900/50 pt-4 text-center">
            <span className="text-green-500 font-bold">digitalshadow.app</span>
            <span className="text-green-700 ml-2">— Run your own scan</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <motion.button
          onClick={handleShare}
          disabled={capturing}
          animate={{ boxShadow: ["0 0 0px #22c55e", "0 0 20px #22c55e", "0 0 0px #22c55e"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-lg text-sm disabled:opacity-50"
        >
          {capturing ? "GENERATING..." : "Generate & Download Report"}
        </motion.button>
      </div>
    </div>
  );
}
