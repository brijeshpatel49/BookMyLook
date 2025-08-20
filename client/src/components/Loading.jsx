export const Loading = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 overflow-hidden">
      <div className="text-center">
        {/* Logo with Glow Effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative w-24 h-24 mx-auto bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
            <img
              src="/logo.png"
              alt="BML"
              className="h-16 w-auto animate-pulse"
            />
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
              style={{
                animation: `bounce 1.4s ease-in-out infinite both`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};
