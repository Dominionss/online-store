import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AdminAddProduct from './pages/admin/AdminAddProduct.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminEditProduct from './pages/admin/AdminEditProduct.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import Cart from './pages/Cart.jsx';
import Category from './pages/Category.jsx';
import Checkout from './pages/Checkout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MyOrders from './pages/MyOrders.jsx';
import NotFound from './pages/NotFound.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Products from './pages/Products.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Seller from './pages/Seller.jsx';
import Wishlist from './pages/Wishlist.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/seller/:sellerId" element={<Seller />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminAddProduct />} />
              <Route path="/admin/products/:id/edit" element={<AdminEditProduct />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
