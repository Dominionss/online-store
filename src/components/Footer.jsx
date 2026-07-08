import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <h3>GlobalBazaar</h3>
        <p>Secure checkout, curated sellers, and sharp prices across everyday categories.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <Link to="/products">All products</Link>
        <Link to="/category/Electronics">Electronics</Link>
        <Link to="/category/Fashion">Fashion</Link>
      </div>
      <div>
        <h4>Account</h4>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Sign in</Link>
      </div>
      <div>
        <h4>Support</h4>
        <a href="mailto:support@globalbazaar.test">Contact</a>
        <a href="#shipping">Shipping</a>
        <a href="#returns">Returns</a>
      </div>
    </footer>
  );
}

export default Footer;
