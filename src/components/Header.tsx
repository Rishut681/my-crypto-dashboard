
// =========================================================================
// 1. Header Component
// =========================================================================
// This component renders the main title and subtitle.
// Since the data is now auto-refreshing, the manual refresh button
// and its associated prop have been removed.
const Header = () => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-900 border-b border-gray-700 rounded-t-xl">
    <div>
      <h1 className="text-3xl font-bold text-white mb-1">
        Crypto Dashboard
      </h1>
      <p className="text-sm text-gray-400">
        Live prices and market data for top cryptocurrencies.
      </p>
    </div>
  </div>
);

export default Header;
