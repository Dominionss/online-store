import { Heart, LayoutDashboard, Menu, Package, ReceiptText, ShoppingCart, UserRound } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
import SearchBar from './SearchBar.jsx';

function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="site-header">
      <div className="top-strip">
        <span>Free shipping over $75</span>
        <span>Buyer protection on every order</span>
        <span>Daily flash deals</span>
      </div>
      <div className="header-main">
        <Link to="/" className="brand" aria-label="Global Bazaar home">
          <span className="brand-mark">GB</span>
          <span>GlobalBazaar</span>
        </Link>
        <SearchBar />
        <nav className="header-actions" aria-label="Main navigation">
          <NavLink to="/products" title="Products">
            <Package size={21} />
            <span>Products</span>
          </NavLink>
          <NavLink to="/wishlist" title="Wishlist">
            <Heart size={21} />
            <span>Wishlist</span>
          </NavLink>
          <NavLink to="/orders" title="My orders">
            <ReceiptText size={21} />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/cart" className="cart-link" title="Cart">
            <ShoppingCart size={21} />
            <span>Cart</span>
            {count > 0 ? <b>{count}</b> : null}
          </NavLink>
          {isAdmin ? (
            <NavLink to="/admin" title="Admin">
              <LayoutDashboard size={21} />
              <span>Admin</span>
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <div className="account-menu">
              <Link to="/profile" title="Profile">
                <UserRound size={21} />
                <span>{user?.name?.split(' ')[0] || 'Account'}</span>
              </Link>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" title="Sign in">
              <UserRound size={21} />
              <span>Sign in</span>
            </NavLink>
          )}
        </nav>
      </div>
      <div className="mobile-menu-line">
        <Menu size={18} />
        <NavLink to="/category/Electronics">Electronics</NavLink>
        <NavLink to="/category/Fashion">Fashion</NavLink>
        <NavLink to="/category/Home">Home</NavLink>
        <NavLink to="/category/Sports">Sports</NavLink>
      </div>
    </header>
  );
}

export default Header;
