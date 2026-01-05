import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, authCheckState } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";

type Props = {
  authenticated: boolean;
  cart: any;
  loading: boolean;
  logout: () => void;
  fetchCart: () => void;
  onTryAutoSignup: () => void;
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({
  authenticated,
  cart,
  loading,
  logout,
  fetchCart,
  onTryAutoSignup,
  children,
}) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    onTryAutoSignup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartCount =
    cart && !loading ? cart.order_items?.length ?? 0 : 0;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              to="/"
              className="text-lg font-bold"
            >
              DJR-ECOMMERCE
            </Link>

            <button
              className="md:hidden"
              onClick={() => setOpened(!opened)}
            >
              ☰
            </button>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>

              {authenticated ? (
                <>
                  {/* Cart */}
                  <div className="relative group">
                    <button className="flex items-center gap-1">
                      🛒 ({cartCount})
                    </button>

                    <div className="absolute right-0 mt-2 w-64 rounded bg-white text-black shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
                      {cart && cart.order_items?.length > 0 && !loading ? (
                        <>
                          {cart.order_items.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="px-4 py-2 hover:bg-gray-100"
                            >
                              <Link
                                to={`/products/${item.item.id}`}
                              >
                                {item.quantity} x {item.item.title}
                              </Link>
                            </div>
                          ))}

                          <hr />

                          <button
                            onClick={() =>
                              navigate("/order-summary")
                            }
                            className="w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            View All →
                          </button>
                        </>
                      ) : (
                        <div className="px-4 py-2">
                          No items in your cart
                        </div>
                      )}
                    </div>
                  </div>

                  {cartCount > 0 && (
                    <Link to="/checkout">Checkout</Link>
                  )}

                  <Link to="/profile">Profile</Link>

                  <button onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Signup</Link>
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
                    onClick={logout}
                    className="block text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    Login
                  </Link>
                  <Link to="/signup" className="block">
                    Signup
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 mt-6">{children}</main>

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
              <a href="https://www.linkedin.com/in/elijah-soladoye-2b99b11b5" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/shodown96/" target="_blank" rel="noreferrer">Instagram</a>
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
                  <li><button onClick={logout}>Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/signup">Signup</Link></li>
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
  logout: () => dispatch(logout()),
  fetchCart: () => dispatch(fetchCart()),
  onTryAutoSignup: () => dispatch(authCheckState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
