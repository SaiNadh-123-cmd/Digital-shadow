import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);

  const sequence = [
    { text: "DIGITAL SHADOW ANALYZER v2.1.0", delay: 0, prefix: "" },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 300, prefix: "divider" },
    { text: "Initializing passive scanner...", delay: 600, prefix: "[ SYS ]" },
    { text: "Browser API hooks loaded", delay: 900, prefix: "[ OK  ]" },
    { text: "Reading hardware fingerprint...", delay: 1200, prefix: "[ SCAN ]" },
    { text: "Accessing network topology...", delay: 1500, prefix: "[ SCAN ]" },
    { text: "Sampling canvas renderer...", delay: 1800, prefix: "[ SCAN ]" },
    { text: "Probing WebGL subsystem...", delay: 2100, prefix: "[ SCAN ]" },
    { text: "23 data points identified", delay: 2400, prefix: "[ WARN ]" },
    { text: "No VPN detected", delay: 2700, prefix: "[ WARN ]" },
    { text: "Generating your Digital Shadow report...", delay: 3000, prefix: "[ OK  ]" },
  ];

  useEffect(() => {
    const timeouts = [];
    sequence.forEach((line) => {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, line]);
      }, line.delay);
      timeouts.push(timeout);
    });

    const finishTimeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3400);
    timeouts.push(finishTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  const getPrefixColor = (prefix) => {
    switch (prefix) {
      case "[ OK  ]":
        return "text-green-400";
      case "[ SCAN ]":
        return "text-cyan-400";
      case "[ WARN ]":
        return "text-yellow-400";
      case "[ SYS ]":
        return "text-gray-400";
      case "divider":
        return "text-green-900";
      default:
        return "text-green-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 p-6 md:p-12 font-mono overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm md:text-base flex gap-2"
          >
            {line.prefix && line.prefix !== "divider" && (
              <span className={`w-20 shrink-0 ${getPrefixColor(line.prefix)}`}>
                {line.prefix}
              </span>
            )}
            <span
              className={
                line.prefix === "divider"
                  ? getPrefixColor("divider")
                  : "text-green-400"
              }
            >
              {line.text}
            </span>
            {index === lines.length - 1 && (
              <span className="animate-pulse text-green-400">|</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
