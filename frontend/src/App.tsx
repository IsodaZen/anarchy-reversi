import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            アナーキーオセロ
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            自由に石を操作できるリバーシゲーム
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* ゲームボードはここに配置 */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6">
            <p className="text-center text-gray-600 dark:text-gray-300">
              ゲームボードを準備中...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
