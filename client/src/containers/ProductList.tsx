import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../axios";
import {
  API_ENDPOINTS
} from "../constants/api";
import { fetchCart } from "../store/actions/cart";

type Props = {
  token: string | null;
  cart: any;
  refreshCart: () => void;
};

const ProductList: React.FC<Props> = ({
  token,
  cart,
  refreshCart,
}) => {
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get(API_ENDPOINTS.Products.List)
      .then((r) => {
        setItems(r.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  const handleAddToCart = (slug: string) => {
    if (!token) return navigate("/login");

    setLoading(true);
    axiosClient
      .post(API_ENDPOINTS.Orders.AddToCart, { slug })
      .then(() => {
        refreshCart();
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  const handlePushToDetails = (id: number) => {
    navigate(`/products/${id}`);
  };

  const checkInCart = (id: number) => {
    if (!cart || !cart.order_items?.length) return false;
    return cart.order_items.some(
      (i: any) => i.item.id === id
    );
  };

  const getOrderItem = (id: number) =>
    cart.order_items.find(
      (i: any) => i.item.id === id
    )?.id;

  const handleRemoveItem = (itemID: number) => {
    const id = getOrderItem(itemID);
    if (!id) return;

    axiosClient
      .delete(API_ENDPOINTS.Orders.DeleteOrderItem(id))
      .then(() => refreshCart())
      .catch(console.error);
  };

  const handleLoading = () => {
    if (loading) {
      return (
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      );
    }

    return (
      <h4 className="text-center text-gray-500">
        Items unavailable, we are currently looking into it.
      </h4>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {items.length > 0
        ? items.map((item, i) => (
          <section key={i} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Image */}
              <div className="md:col-span-3">
                <div className="relative overflow-hidden rounded border">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full object-cover p-2"
                  />
                  <Link
                    to={`/products/${item.id}`}
                    className="absolute inset-0"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-9">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-7">
                    <h5 className="font-semibold">
                      {item.title}
                    </h5>
                    <p className="text-sm text-gray-500 uppercase">
                      {item.category}
                    </p>
                    <hr className="my-2" />
                    <p>
                      {item.description.slice(0, 180)}
                      …
                    </p>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="mb-2">
                      {item.discount_price ? (
                        <>
                          <span className="mr-2 font-bold text-red-600">
                            ${item.discount_price}
                          </span>
                          <span className="line-through text-gray-400">
                            ${item.price}
                          </span>
                        </>
                      ) : (
                        <span>${item.price}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={
                          item.variations?.length
                            ? () =>
                              handlePushToDetails(
                                item.id
                              )
                            : () =>
                              handleAddToCart(
                                item.slug
                              )
                        }
                        className="rounded bg-gray-800 px-4 py-2 text-white"
                      >
                        Add to cart
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/products/${item.id}`
                          )
                        }
                        className="rounded border px-4 py-2"
                      >
                        Details
                      </button>

                      {checkInCart(item.id) && (
                        <button
                          onClick={() =>
                            handleRemoveItem(
                              item.id
                            )
                          }
                          className="rounded bg-red-600 px-4 py-2 text-white"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))
        : handleLoading()}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.auth.token,
  cart: state.cart.shoppingCart,
});

const mapDispatchToProps = (dispatch: any) => ({
  refreshCart: () => dispatch(fetchCart()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
