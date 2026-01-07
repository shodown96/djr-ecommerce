import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { signOut, authCheckState } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";

type Props = {
  authenticated: boolean;
  cart: any;
  loading: boolean;
  signOut: () => void;
  fetchCart: () => void;
  refreshAuthState: () => void;
};

const Layout: React.FC<Props> = ({
  authenticated,
  cart,
  loading,
  signOut,
  fetchCart,
  refreshAuthState,
}) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  // Calculate cart item count safely
  const cartCount = cart && !loading ? cart.order_items?.length ?? 0 : 0;

  useEffect(() => {
    // Fetch cart and refresh auth state on layout mount
    fetchCart();
    refreshAuthState();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-lg font-bold">
              DJR ECOMMERCE
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden"
              onClick={() => setOpened(!opened)}
            >
              ☰
            </button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>

              {authenticated ? (
                <>
                  {/* Cart dropdown wrapper */}
                  <div className="relative group">
                    {/* Cart button */}
                    <button className="flex items-center gap-1" onClick={() => navigate("/order-summary")}>
                      Cart ({cartCount})
                    </button>
                  </div>

                  {/* Show checkout only if cart has items */}
                  {cartCount > 0 && (
                    <Link to="/checkout">Checkout</Link>
                  )}

                  <Link to="/profile">Profile</Link>

                  <button onClick={signOut}>Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/sign-in">Signin</Link>
                  <Link to="/sign-up">Signup</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          {opened && (
            <div className="md:hidden space-y-2 pb-4">
              <Link to="/" className="block">
                Home
              </Link>
              <Link to="/products" className="block">
                Products
              </Link>

              {authenticated ? (
                <>
                  <Link to="/profile" className="block">
                    Profile
                  </Link>
                  <button
                    onClick={signOut}
                    className="block text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" className="block">
                    Signin
                  </Link>
                  <Link to="/sign-up" className="block">
                    Signup
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 mt-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-10">
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-bold mb-2">DJR-ECOMMERCE</h5>
            <p className="text-sm text-gray-300">
              Here you can use rows and columns to organize your
              footer content.
            </p>

            <div className="flex gap-4 mt-4">
              <a href="https://web.facebook.com/elijah.soladoye/" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://github.com/shodown96/" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/elijah-soladoye" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

          <div>
            <h5 className="font-bold mb-2">Links</h5>
            <ul className="space-y-1">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              {authenticated ? (
                <>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><button onClick={signOut}>Sign out</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/sign-in">Signin</Link></li>
                  <li><Link to="/sign-up">Signup</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-2">Contacts</h5>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>New York, Avenue Street 10</li>
              <li>042 876 836 908</li>
              <li>company@example.com</li>
              <li>Mon – Fri: 10 – 17</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm py-4 bg-gray-950">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://elijahsoladoye.netlify.app"
            className="underline"
          >
            Elijah Soladoye
          </a>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  authenticated: state.auth.token !== null,
  cart: state.cart.shoppingCart,
  loading: state.cart.loading,
});

const mapDispatchToProps = (dispatch: any) => ({
  signOut: () => dispatch(signOut()),
  fetchCart: () => dispatch(fetchCart()),
  refreshAuthState: () => dispatch(authCheckState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
