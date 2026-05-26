import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function PrivacyScore({ score, loading }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Invert colors: high score = safe (green), low score = danger (red)
  const getStrokeColor = (s) => {
    if (s < 20) return "#ef4444"; // red
    if (s < 50) return "#f59e0b"; // amber
    if (s < 80) return "#eab308"; // yellow
    return "#10b981"; // green
  };

  const springScore = useSpring(0, { stiffness: 100, damping: 20 });
  const dashoffset = useTransform(springScore, (latest) => {
    return 339.3 * (1 - latest / 100);
  });
  
  const strokeColor = useTransform(springScore, (latest) => {
    return getStrokeColor(latest);
  });

  useEffect(() => {
    if (!loading) {
      springScore.set(score);
    }
  }, [score, loading, springScore]);

  useEffect(() => {
    const unsubscribe = springScore.on("change", (latest) => {
      setDisplayScore(Math.round(latest));
    });
    return unsubscribe;
  }, [springScore]);

  const getVerdict = (s) => {
    if (s >= 80) return "LOW EXPOSURE — Your shadow is faint.";
    if (s >= 50) return "MODERATE EXPOSURE — You are visible.";
    if (s >= 20) return "HIGH EXPOSURE — Your data is an open book.";
    return "CRITICAL — You are completely transparent.";
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border border-green-900/60 rounded-lg">
      <div className="relative w-32 h-32 mb-4">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#0f172a"
            strokeWidth="10"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray="339.3"
            style={{ strokeDashoffset: dashoffset }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono text-white">
            {displayScore}
          </span>
        </div>
      </div>
      <div className="text-green-600 text-xs font-bold uppercase tracking-wider mb-2">
        Privacy Score
      </div>
      <div className={`text-sm font-mono text-center px-4 ${getStrokeColor(displayScore).replace('#10b981', 'text-green-400').replace('#eab308', 'text-yellow-400').replace('#f59e0b', 'text-yellow-500').replace('#ef4444', 'text-red-400')}`} style={{ color: getStrokeColor(displayScore) }}>
        {getVerdict(displayScore)}
      </div>
    </div>
  );
}
