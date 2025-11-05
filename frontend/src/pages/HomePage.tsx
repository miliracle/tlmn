export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Tiến Lên Miền Nam</h1>
      <div className="space-y-4">
        <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700">
          Create Table
        </button>
        <button className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700">
          Practice Mode
        </button>
      </div>
    </div>
  );
}

