import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

interface ChartData {
  prices: [number, number][];
}

// =========================================================================
// 3. PriceChart Component
// =========================================================================
// This component handles the rendering of the price chart and the
// timeframe selection buttons. It manages its own state for the timeframe.
const PriceChart = ({ coinId }: { coinId: string }) => {
  // Use a string representation for days that the API understands.
  const [timeframe, setTimeframe] = useState('7d');

  const timeframeMapping: { [key: string]: string } = {
    '6h': '0.25',
    '1d': '1',
    '7d': '7',
    '1m': '30',
  };

  const fetchCoinChartData = async (id: string, days: string): Promise<ChartData> => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data: btcChartData, isLoading: isChartLoading } = useQuery<ChartData, Error>({
    queryKey: ['btcChartData', timeframe],
    queryFn: () => fetchCoinChartData(coinId, timeframeMapping[timeframe]),
    refetchInterval: 60000, // Refreshes the chart data every 60 seconds
  });

  if (isChartLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading chart data...
      </div>
    );
  }

  if (!btcChartData) {
    return (
      <div className="p-6 text-center text-gray-500">
        Could not load chart data.
      </div>
    );
  }

  const chartData = btcChartData.prices
    ? btcChartData.prices.map((item: [number, number]) => ({
        date: new Date(item[0]).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        price: item[1]
      }))
    : [];

  return (
    <div className="p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">
          Bitcoin Price ({timeframe})
        </h2>
        <div className="space-x-2">
          {['6h', '1d', '7d', '1m'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
