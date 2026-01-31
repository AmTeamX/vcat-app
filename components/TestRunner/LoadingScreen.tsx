export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 md:border-4 border-blue-400 text-center max-w-xl w-full">
                <div className="text-6xl md:text-8xl mb-4 md:mb-6 animate-bounce">📝</div>
                <h2 className="text-3xl md:text-5xl font-bold text-blue-600 mb-4">
                    กำลังโหลดข้อต่อไป...
                </h2>
                <div className="flex gap-2 justify-center">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
