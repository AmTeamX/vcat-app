export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-blue-400 text-center">
                <div className="text-8xl mb-6 animate-bounce">📝</div>
                <h2 className="text-5xl font-bold text-blue-600 mb-4">
                    Loading Next Question...
                </h2>
                <div className="flex gap-2 justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
