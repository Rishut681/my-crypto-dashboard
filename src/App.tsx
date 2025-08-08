import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import CryptoCard from './components/CryptoCard';
import PriceChart from './components/PriceChart';

// =========================================================================
// 4. Main App Component
// =========================================================================

// Define the shape of the data we expect from the Coingecko API
interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

// Create a client instance for react-query.
// This is done outside the component so it's not recreated on every render.
const queryClient = new QueryClient();

// The main component that fetches the data and renders the
// other, smaller components.
const App = () => {

  const fetchCryptoData = async (): Promise<CryptoData[]> => {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,dogecoin&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h'
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, isLoading, isError, error } = useQuery<CryptoData[], Error>({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
    refetchInterval: 20000, // Auto-refreshes every 20 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p>Loading market data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  const bitcoinData = data?.find((coin: CryptoData) => coin.id === 'bitcoin');
  const ethereumData = data?.find((coin: CryptoData) => coin.id === 'ethereum');
  const dogecoinData = data?.find((coin: CryptoData) => coin.id === 'dogecoin');

  if (!bitcoinData || !ethereumData || !dogecoinData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p>Could not find all cryptocurrency data.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto rounded-xl shadow-2xl">
        {/* The Header no longer needs the onRefresh prop */}
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-900 border-b border-gray-700">
          <CryptoCard
            name={bitcoinData.name}
            symbol={bitcoinData.symbol}
            price={bitcoinData.current_price}
            change={bitcoinData.price_change_percentage_24h}
            marketCap={bitcoinData.market_cap}
          />
          <CryptoCard
            name={ethereumData.name}
            symbol={ethereumData.symbol}
            price={ethereumData.current_price}
            change={ethereumData.price_change_percentage_24h}
            marketCap={ethereumData.market_cap}
          />
          <CryptoCard
            name={dogecoinData.name}
            symbol={dogecoinData.symbol}
            price={dogecoinData.current_price}
            change={dogecoinData.price_change_percentage_24h}
            marketCap={dogecoinData.market_cap}
          />
        </div>

        <div className="p-6 bg-slate-900 rounded-b-xl">
          <PriceChart
            coinId="bitcoin"
          />
        </div>
      </div>
    </div>
  );
};

// This component wraps the App with the QueryClientProvider.
// This is the correct component to export for your application's entry point.
function WrappedApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default WrappedApp;
