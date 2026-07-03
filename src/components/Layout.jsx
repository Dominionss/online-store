import Footer from './Footer.jsx';
import Header from './Header.jsx';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
