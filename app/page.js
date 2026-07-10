'use client';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleCheckIn = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data);
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 75) return 'text-red-600 border-red-600';
    if (score >= 45) return 'text-yellow-600 border-yellow-600';
    return 'text-green-600 border-green-600';
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 mt-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          🛡️ Safient <span className="text-sm font-normal text-gray-400">| Check-In</span>
        </h1>
        <p className="text-gray-500 mt-1">Describe any situation. I'll guide you safely.</p>

        <div className="flex gap-2 mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheckIn()}
            placeholder='e.g. "My boyfriend is asking for my Instagram password."'
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleCheckIn}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Thinking...' : 'Check In'}
          </button>
        </div>

        {response && (
          <div className="mt-8 border-t pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                {response.category}
              </span>
              <div className={`flex items-center gap-2 font-bold text-lg border-2 rounded-full px-4 py-1 ${getRiskColor(response.risk_score)}`}>
                Risk: {response.risk_score}/100
              </div>
            </div>

            <p className="text-gray-700 bg-blue-50 p-4 rounded-xl">
              {response.brief_analysis}
            </p>

            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">📋 Action Steps</h3>
              <ul className="list-decimal list-inside bg-gray-50 p-4 rounded-xl space-y-1">
                {response.action_steps.map((step, idx) => (
                  <li key={idx} className="text-gray-700">{step}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">🛡️ Try saying this:</h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl italic text-gray-700">
                "{response.safety_script}"
              </div>
            </div>

            {response.red_flags && response.red_flags.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-600 flex items-center gap-2">🚩 Red Flags Noticed</h3>
                <ul className="list-disc list-inside bg-red-50 p-4 rounded-xl">
                  {response.red_flags.map((flag, idx) => (
                    <li key={idx} className="text-red-800">{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}