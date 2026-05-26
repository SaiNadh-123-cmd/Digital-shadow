import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrowserFingerprint } from "./hooks/useBrowserFingerprint";
import { useIPData } from "./hooks/useIPData";

import { BootSequence } from "./components/BootSequence";
import { ScanLine } from "./components/ScanLine";
import { TerminalWindow } from "./components/TerminalWindow";
import { DataRow } from "./components/DataRow";
import { PrivacyScore } from "./components/PrivacyScore";
import { ShareCard } from "./components/ShareCard";
import { AdBanner } from "./components/AdBanner";

function computePrivacyScore(fingerprint, ipData) {
  let score = 100;
  if (fingerprint?.battery !== null) score -= 15;
  if (fingerprint?.doNotTrack !== "Enabled") score -= 10;
  if (fingerprint?.webgl?.renderer && fingerprint.webgl.renderer !== "N/A") score -= 15;
  if (fingerprint?.canvasHash) score -= 15;
  if (fingerprint?.connection !== null) score -= 10;
  if (fingerprint?.plugins?.length >= 3) score -= 10;
  if (ipData && !["vpn", "privacy", "mullvad", "nordvpn", "expressvpn", "proton"].some(v => (ipData.org || "").toLowerCase().includes(v))) score -= 25;
  return Math.max(0, score);
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fingerprint = useBrowserFingerprint();
  const { ipData, loading: ipLoading } = useIPData();

  const privacyScore = useMemo(() => {
    return computePrivacyScore(fingerprint, ipData);
  }, [fingerprint, ipData]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "hardware", label: "Hardware" },
    { id: "network", label: "Network" },
    { id: "fingerprint", label: "Fingerprint" },
    { id: "protect", label: "Protect Yourself" },
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-x-hidden selection:bg-green-500/30">
      <ScanLine />

      <AnimatePresence>
        {!booted && (
          <BootSequence key="boot" onComplete={() => setBooted(true)} />
        )}
      </AnimatePresence>

      {booted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {/* Header */}
          <header className="bg-black/90 border-b border-green-900/40 sticky top-0 z-50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Digital Shadow Logo" className="w-8 h-8 object-contain rounded-full" />
                <div className="font-bold text-lg md:text-xl">◉ DIGITAL SHADOW</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-cyan-400 text-sm hidden md:block">
                  {ipLoading ? "..." : ipData?.ip}
                </div>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-green-950 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-900/50"
                >
                  SCANNING COMPLETE
                </motion.div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <nav className="border-b border-green-900/30 bg-black/50 overflow-x-auto scrollbar-hide">
            <div className="max-w-6xl mx-auto px-4 flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 md:px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-black"
                      : "text-green-600 hover:text-green-400"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-1 bg-green-400 rounded"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Left 2 cols: Tab Panel */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "overview" && (
                    <TerminalWindow title="system.shadow.report">
                      <div className="text-green-500 font-bold mb-2"> {">"} IDENTITY</div>
                      <DataRow label="Public IP" value={ipData?.ip} severity="danger" delayIndex={0} />
                      <DataRow label="City" value={ipData ? `${ipData.city}, ${ipData.region}` : null} severity="warn" delayIndex={1} />
                      <DataRow label="Country" value={ipData?.country_name} severity="info" delayIndex={2} />
                      <DataRow label="ISP / Org" value={ipData?.org} severity="warn" delayIndex={3} />
                      <DataRow label="Coordinates" value={ipData ? `${ipData.latitude}, ${ipData.longitude}` : null} severity="danger" delayIndex={4} />
                      <DataRow label="Timezone" value={fingerprint?.timezone} severity="info" delayIndex={5} />
                      <DataRow label="Currency" value={ipData ? `${ipData.currency} (${ipData.currency_name})` : null} severity="info" delayIndex={6} />
                      
                      <AdBanner slot="9545869440" layoutKey="-fb+5w+4e-db+86" format="fluid" position="feed" />
                      
                      <div className="my-4 border-t border-green-900/50"></div>
                      
                      <div className="text-green-500 font-bold mb-2"> {">"} BROWSER</div>
                      <DataRow label="Language" value={fingerprint?.language?.primary} severity="info" delayIndex={7} />
                      <DataRow label="Do Not Track" value={fingerprint?.doNotTrack} severity={fingerprint?.doNotTrack === "Enabled" ? "safe" : "danger"} delayIndex={8} />
                      <DataRow label="Cookies" value={fingerprint?.cookiesEnabled ? "Enabled" : "Disabled"} severity={fingerprint?.cookiesEnabled ? "warn" : "safe"} delayIndex={9} />
                      <DataRow label="PDF Viewer" value={fingerprint?.pdfViewer ? "Built-in" : "None"} severity="info" delayIndex={10} />
                    </TerminalWindow>
                  )}

                  {activeTab === "hardware" && (
                    <TerminalWindow title="hardware.recon">
                      <div className="text-green-500 font-bold mb-2"> {">"} DISPLAY</div>
                      <DataRow label="Resolution" value={fingerprint?.screen ? `${fingerprint.screen.width}×${fingerprint.screen.height}` : null} severity="warn" delayIndex={0} />
                      <DataRow label="Available Area" value={fingerprint?.screen ? `${fingerprint.screen.availWidth}×${fingerprint.screen.availHeight}` : null} severity="info" delayIndex={1} />
                      <DataRow label="Color Depth" value={fingerprint?.screen ? `${fingerprint.screen.colorDepth}-bit` : null} severity="info" delayIndex={2} />
                      <DataRow label="Pixel Ratio" value={fingerprint?.screen?.devicePixelRatio} severity="info" delayIndex={3} />
                      <DataRow label="Window Inner" value={fingerprint?.windowSize?.inner} severity="info" delayIndex={4} />
                      
                      <AdBanner slot="9545869440" layoutKey="-fb+5w+4e-db+86" format="fluid" position="feed" />
                      
                      <div className="my-4 border-t border-green-900/50"></div>
                      
                      <div className="text-green-500 font-bold mb-2"> {">"} PROCESSOR</div>
                      <DataRow label="CPU Cores" value={fingerprint?.cpu?.cores} severity="warn" delayIndex={5} />
                      <DataRow label="Platform" value={fingerprint?.cpu?.platform} severity="warn" delayIndex={6} />
                      <DataRow label="Device Memory" value={fingerprint?.memory ? `${fingerprint.memory} GB` : null} severity="warn" delayIndex={7} />
                      
                      <div className="my-4 border-t border-green-900/50"></div>
                      
                      <div className="text-green-500 font-bold mb-2"> {">"} INPUT</div>
                      <DataRow label="Touch Points" value={fingerprint?.touchPoints} severity="info" delayIndex={8} />
                      <DataRow label="Battery Level" value={fingerprint?.battery?.level ?? "Not available"} severity={fingerprint?.battery ? "danger" : "safe"} delayIndex={9} />
                      <DataRow label="Charging" value={fingerprint?.battery ? (fingerprint.battery.charging ? "Yes" : "No") : null} severity="info" delayIndex={10} />
                      <DataRow label="Charge Time" value={fingerprint?.battery?.chargingTime} severity="info" delayIndex={11} />
                      
                      <div className="my-4 border-t border-green-900/50"></div>
                      
                      <div className="text-green-500 font-bold mb-2"> {">"} BROWSER ENGINE</div>
                      <DataRow label="Plugins Detected" value={fingerprint?.plugins ? (fingerprint.plugins.length > 0 ? fingerprint.plugins.join(", ") : "None") : null} severity={fingerprint?.plugins?.length > 3 ? "warn" : "safe"} delayIndex={12} />
                      <DataRow label="MIME Types" value={fingerprint?.mimeTypes} severity="info" delayIndex={13} />
                      <DataRow label="History Length" value={fingerprint?.history} severity="warn" delayIndex={14} />
                    </TerminalWindow>
                  )}

                  {activeTab === "network" && (
                    <TerminalWindow title="network.trace">
                      <DataRow label="Connection Type" value={fingerprint?.connection?.effectiveType ?? "Unknown"} severity="info" delayIndex={0} />
                      <DataRow label="Downlink Speed" value={fingerprint?.connection?.downlink ? `${fingerprint.connection.downlink} Mbps` : "N/A"} severity="info" delayIndex={1} />
                      <DataRow label="Round-Trip Time" value={fingerprint?.connection?.rtt ? `${fingerprint.connection.rtt}ms` : "N/A"} severity="info" delayIndex={2} />
                      <DataRow label="Data Saver" value={fingerprint?.connection ? (fingerprint.connection.saveData ? "Active" : "Inactive") : null} severity="info" delayIndex={3} />
                      <DataRow label="Online Status" value={fingerprint?.onLine ? "Connected" : "Offline"} severity="safe" delayIndex={4} />
                      <DataRow label="AS Number" value={ipData?.asn} severity="warn" delayIndex={5} />
                      <DataRow label="VPN Detected" value="None detected" severity="danger" delayIndex={6} />
                      <DataRow label="UTC Offset" value={ipData?.utc_offset} severity="info" delayIndex={7} />
                      <DataRow label="Calling Code" value={ipData?.calling_code} severity="info" delayIndex={8} />

                      <AdBanner slot="9545869440" layoutKey="-fb+5w+4e-db+86" format="fluid" position="feed" />

                      {ipData && (
                        <div className="mt-6">
                          <div className="bg-green-950/20 border border-green-900/30 rounded-lg h-48 flex items-center justify-center">
                            <span className="text-green-600 text-sm">
                              [ MAP ] Approximate location: {ipData.latitude}, {ipData.longitude}
                            </span>
                          </div>
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${ipData.latitude}&mlon=${ipData.longitude}&zoom=12`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-3 text-cyan-400 hover:text-cyan-300 hover:underline"
                          >
                            $ → View on OpenStreetMap
                          </a>
                        </div>
                      )}
                    </TerminalWindow>
                  )}

                  {activeTab === "fingerprint" && (
                    <TerminalWindow title="fingerprint.extract">
                      <div className="bg-red-950/30 border border-red-900/40 rounded p-3 mb-4 text-red-400 text-xs leading-relaxed">
                        ⚠ These fingerprints are unique to your device+browser combination. No login required to track you.
                      </div>
                      <DataRow label="Canvas Hash" value={fingerprint?.canvasHash} severity="danger" delayIndex={0} />
                      <DataRow label="WebGL Renderer" value={fingerprint?.webgl?.renderer} severity="danger" delayIndex={1} />
                      <DataRow label="GPU Vendor" value={fingerprint?.webgl?.vendor} severity="warn" delayIndex={2} />
                      <DataRow label="WebGL Hash" value={fingerprint?.webgl?.hash} severity="danger" delayIndex={3} />
                      
                      <AdBanner slot="9545869440" layoutKey="-fb+5w+4e-db+86" format="fluid" position="feed" />
                      
                      <DataRow label="User Agent" value={fingerprint?.userAgent ? fingerprint.userAgent.slice(0, 80) + "..." : null} severity="warn" delayIndex={4} />
                      <DataRow label="Browser Vendor" value={fingerprint?.vendor} severity="info" delayIndex={5} />
                      <DataRow label="All Languages" value={fingerprint?.language?.all} severity="warn" delayIndex={6} />

                      <div className="mt-6 bg-green-950/10 border border-green-900/30 rounded p-4 text-green-700 text-xs leading-relaxed">
                        Your canvas fingerprint is generated by asking your GPU to render text and shapes. Due to differences in GPU hardware, drivers, and fonts installed on your system, the pixel output is subtly unique — creating a tracking signature without using cookies.
                      </div>
                    </TerminalWindow>
                  )}

                  {activeTab === "protect" && (
                    <div className="space-y-6">
                      <TerminalWindow title="remediation.guide">
                        <div className="space-y-3">
                          <div className="bg-green-950/20 border-l-4 border-green-500 pl-4 py-3">
                            <div className="font-bold text-green-400 mb-1">[ HIGH PRIORITY ] Use a VPN</div>
                            <div className="text-sm text-green-300 mb-3">Your IP and location are the most trackable data points. A VPN masks both.</div>
                            <AdBanner slot="protect-page" position="sidebar" />
                          </div>
                          
                          <div className="bg-green-950/20 border-l-4 border-green-500 pl-4 py-3">
                            <div className="font-bold text-green-400 mb-1">[ HIGH PRIORITY ] Enable Do Not Track</div>
                            <div className="text-sm text-green-300">Go to browser Settings → Privacy → Enable Do Not Track. It won't stop all tracking but signals intent.</div>
                          </div>

                          <div className="bg-green-950/20 border-l-4 border-green-500 pl-4 py-3">
                            <div className="font-bold text-green-400 mb-1">[ MEDIUM ] Use Firefox with uBlock Origin</div>
                            <div className="text-sm text-green-300">Blocks canvas and WebGL fingerprinting at the browser level. Install from addons.mozilla.org.</div>
                          </div>

                          <div className="bg-green-950/20 border-l-4 border-green-500 pl-4 py-3">
                            <div className="font-bold text-green-400 mb-1">[ MEDIUM ] Use Brave Browser</div>
                            <div className="text-sm text-green-300">Has built-in fingerprint randomization. Download at brave.com.</div>
                          </div>

                          <div className="bg-green-950/20 border-l-4 border-green-500 pl-4 py-3">
                            <div className="font-bold text-green-400 mb-1">[ LOW ] Disable Battery Status API</div>
                            <div className="text-sm text-green-300">Firefox already blocks this by default. Chrome users should use an extension like Chameleon.</div>
                          </div>

                          <div className="bg-green-950/20 border-l-4 border-green-500 pl-4 py-3">
                            <div className="font-bold text-green-400 mb-1">[ LOW ] Use a Privacy-Respecting DNS</div>
                            <div className="text-sm text-green-300">Switch to 1.1.1.1 (Cloudflare) or 9.9.9.9 (Quad9) in your router settings.</div>
                          </div>
                        </div>
                      </TerminalWindow>

                      <ShareCard ipData={ipData} fingerprint={fingerprint} score={privacyScore} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right col: Gauge + Ads */}
            <div className="hidden lg:flex flex-col gap-6">
              <PrivacyScore score={privacyScore} loading={ipLoading} />
              <div className="sticky top-24">
                <AdBanner slot="sidebar" position="sidebar" />
              </div>
            </div>
          </main>

          {/* Bottom Ad */}
          <div className="max-w-6xl mx-auto px-4 pb-12">
            <AdBanner slot="bottom-leaderboard" position="bottom" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
