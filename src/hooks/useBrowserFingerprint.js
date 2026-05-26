import { useState, useEffect } from "react";
import { getCanvasFingerprint } from "../utils/canvasFingerprint";
import { getWebGLFingerprint } from "../utils/webglFingerprint";

export function useBrowserFingerprint() {
  const [fingerprint, setFingerprint] = useState({
    screen: null,
    cpu: null,
    memory: null,
    language: null,
    timezone: null,
    touchPoints: null,
    doNotTrack: null,
    cookiesEnabled: null,
    userAgent: null,
    vendor: null,
    onLine: null,
    connection: null,
    battery: null,
    canvasHash: null,
    webgl: null,
    plugins: null,
    mimeTypes: null,
    history: null,
    javaEnabled: null,
    pdfViewer: null,
    windowSize: null,
  });

  useEffect(() => {
    // Synchronous data — collect immediately
    const syncData = {
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        devicePixelRatio: window.devicePixelRatio,
      },
      cpu: {
        cores: navigator.hardwareConcurrency,
        platform: navigator.platform,
      },
      memory: navigator.deviceMemory ?? "Not disclosed",
      language: {
        primary: navigator.language,
        all: navigator.languages?.join(", "),
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      touchPoints: navigator.maxTouchPoints,
      doNotTrack: navigator.doNotTrack === "1" ? "Enabled" : "Disabled",
      cookiesEnabled: navigator.cookieEnabled,
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      onLine: navigator.onLine,
      connection: navigator.connection
        ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
            saveData: navigator.connection.saveData,
          }
        : null,
      canvasHash: getCanvasFingerprint(),
      webgl: getWebGLFingerprint(),
      plugins: Array.from(navigator.plugins)
        .slice(0, 5)
        .map((p) => p.name),
      mimeTypes: navigator.mimeTypes.length,
      history: history.length,
      javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
      pdfViewer: navigator.pdfViewerEnabled ?? false,
      windowSize: {
        inner: `${window.innerWidth}x${window.innerHeight}`,
        outer: `${window.outerWidth}x${window.outerHeight}`,
      },
      battery: null, // async below
    };

    setFingerprint((prev) => ({ ...prev, ...syncData }));

    // Async — battery
    if (navigator.getBattery) {
      navigator
        .getBattery()
        .then((battery) => {
          setFingerprint((prev) => ({
            ...prev,
            battery: {
              level: (battery.level * 100).toFixed(0) + "%",
              charging: battery.charging,
              chargingTime:
                battery.chargingTime === Infinity
                  ? "N/A"
                  : battery.chargingTime + "s",
              dischargingTime:
                battery.dischargingTime === Infinity
                  ? "N/A"
                  : battery.dischargingTime + "s",
            },
          }));
        })
        .catch(() => {
          setFingerprint((prev) => ({ ...prev, battery: null }));
        });
    }
  }, []);

  return fingerprint;
}
