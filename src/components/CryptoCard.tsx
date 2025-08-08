// =========================================================================
// 2. CryptoCard Component
// =========================================================================
// This is a reusable component to display a single cryptocurrency's details.
// It receives data for a single coin as props, making it highly modular.

// Define the shape of the props this component expects.
interface CryptoCardProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
}

// A helper function to format large numbers for better readability
const formatNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  return num.toLocaleString();
};

const CryptoCard = ({ name, symbol, price, change, marketCap }: CryptoCardProps) => {
  const isPositive = change >= 0;
  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">
          {name}
        </h2>
        <span className="text-sm font-medium text-gray-400">
          {symbol.toUpperCase()}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-2">
        ${price.toFixed(2)}
      </div>
      <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        <span className="mr-1">{isPositive ? '▲' : '▼'}</span>
        {change.toFixed(2)}%
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Market Cap: ${formatNumber(marketCap)}
      </div>
    </div>
  );
};

export default CryptoCard;
