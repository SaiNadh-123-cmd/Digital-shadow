import { motion } from "framer-motion";

export function DataRow({ label, value, severity = "info", delayIndex = 0 }) {
  const getSeverityColors = (sev) => {
    switch (sev) {
      case "safe":
        return { text: "text-green-400", badge: "bg-green-950 text-green-400" };
      case "warn":
        return { text: "text-yellow-400", badge: "bg-yellow-950 text-yellow-400" };
      case "danger":
        return { text: "text-red-400", badge: "bg-red-950 text-red-400" };
      case "info":
      default:
        return { text: "text-cyan-400", badge: "bg-cyan-950 text-cyan-400" };
    }
  };

  const colors = getSeverityColors(severity);
  const isPlaceholder = value === null || value === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delayIndex * 0.06 }}
      className="flex items-start gap-3 py-1.5 border-b border-green-950/30"
    >
      <div className="text-green-600 text-xs w-52 shrink-0 uppercase tracking-wider mt-0.5">
        {label}
      </div>
      <div className="flex-1">
        {isPlaceholder ? (
          <span className="text-green-950 animate-pulse font-bold text-sm">
            ▓▓▓▓▓▓▓▓
          </span>
        ) : (
          <span className={`font-bold text-sm ${colors.text}`}>{value}</span>
        )}
      </div>
      <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
        {severity}
      </div>
    </motion.div>
  );
}
