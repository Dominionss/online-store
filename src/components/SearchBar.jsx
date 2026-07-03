import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const submit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products, brands, and deals"
        aria-label="Search marketplace"
      />
      <button type="submit" aria-label="Search">
        <Search size={20} />
      </button>
    </form>
  );
}

export default SearchBar;
