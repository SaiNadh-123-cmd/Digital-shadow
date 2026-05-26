export function TerminalWindow({ title, children }) {
  return (
    <div className="bg-black border border-green-900/60 rounded-lg overflow-hidden font-mono">
      <div className="bg-green-950/40 border-b border-green-900/40 px-4 py-2 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="text-green-400 text-xs font-bold ml-2">
          $ {title}
        </div>
      </div>
      <div className="p-4 text-green-300 text-sm">
        {children}
      </div>
    </div>
  );
}
