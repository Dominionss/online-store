import { useSearchParams } from 'react-router-dom';
import Products from './Products.jsx';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return <Products title={query ? `Search results for "${query}"` : 'Search results'} mode="search" />;
}

export default SearchResults;
