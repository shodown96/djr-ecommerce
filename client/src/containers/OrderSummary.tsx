import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../axios";
import { API_ENDPOINTS } from "../constants/api";
import { fetchCart } from "../store/actions/cart";

type OrderItem = {
  id: string;
  quantity: number;
  final_price: number;
  item: {
    slug: string;
    title: string;
    price: number;
    discount_price?: number;
  };
  item_variations: {
    id: string;
    variation: { name: string };
    value: string;
  }[];
};

type Cart = {
  order_items: OrderItem[];
  total: number;
  coupon?: {
    code: string;
    amount: number;
  };
};

type Props = {
  isAuthenticated: boolean;
  cart: Cart | null;
  cartError: any;
  cartLoading: boolean;
  refreshCart: () => void;
};

const OrderSummary: React.FC<Props> = ({
  isAuthenticated,
  cart,
  cartError,
  cartLoading,
  refreshCart,
}) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    error: null as any,
    loading: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, navigate]);

  const renderVariations = (orderItem: OrderItem) => {
    return orderItem.item_variations
      .map((iv) => `${iv.variation.name}: ${iv.value}`)
      .join(", ");
  };

  const handleFormatData = (itemVariations: any) => {
    return Object.keys(itemVariations).map(
      (key) => itemVariations[key].id
    );
  };

  const handleAddToCart = (slug: string, itemVariations: any) => {
    setState({ loading: true, error: null });
    const variations = handleFormatData(itemVariations);

    axiosClient
      .post(API_ENDPOINTS.Orders.AddToCart, { slug, variations })
      .then(() => {
        refreshCart();
        setState({ loading: false, error: null });
      })
      .catch((err) => {
        setState({ loading: false, error: err });
      });
  };

  const handleRemoveQuantityFromCart = (slug: string) => {
    axiosClient
      .post(API_ENDPOINTS.Orders.UpdateOrderItemQuantity, { slug })
      .then(() => refreshCart())
      .catch((err) => setState({ ...state, error: err }));
  };

  const handleRemoveItem = (itemID: string) => {
    axiosClient
      .delete(API_ENDPOINTS.Orders.DeleteOrderItem(itemID))
      .then(() => refreshCart())
      .catch((err) => setState({ ...state, error: err }));
  };

  const renderAlert = () => {
    if (cartLoading) {
      return (
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      );
    }

    if (cartError) {
      return (
        <div className="rounded bg-red-100 p-4 text-red-800">
          <h4 className="font-semibold">Cart Error</h4>
          <p>{cartError.response?.data}</p>
        </div>
      );
    }

    return (
      <div className="rounded bg-gray-800 p-4 text-white">
        <h4 className="font-semibold">Cart Empty</h4>
        <p>You don't have an active cart</p>
      </div>
    );
  };

  if (!cart) {
    return renderAlert();
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h3 className="text-2xl font-semibold mb-4">
        Order Summary
      </h3>

      {state.error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-800">
          <h3 className="font-semibold">
            There were some errors with your submission
          </h3>
          {state.error.response?.data ? (
            <p>{JSON.stringify(state.error.response.data)}</p>
          ) : (
            <p>{state.error.message}</p>
          )}
        </div>
      )}

      {cart.order_items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Item</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2 text-center">
                  Quantity
                </th>
                <th className="border px-4 py-2">Total</th>
              </tr>
            </thead>

            <tbody>
              {cart.order_items.map((item, i) => (
                <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">
                    {i + 1}
                  </td>

                  <td className="border px-4 py-2">
                    <div className="font-medium">
                      {item.item.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {renderVariations(item)}
                    </div>
                  </td>

                  <td className="border px-4 py-2 font-semibold">
                    ${item.item.price}
                  </td>

                  <td className="border px-4 py-2">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          handleAddToCart(
                            item.item.slug,
                            item.item_variations
                          )
                        }
                        className="px-2 font-bold"
                      >
                        +
                      </button>

                      <span>{item.quantity}</span>

                      {!item.item_variations.length ? (
                        <button
                          onClick={() =>
                            handleRemoveQuantityFromCart(
                              item.item.slug
                            )
                          }
                          className="px-2 font-bold"
                        >
                          −
                        </button>
                      ) : (
                        <span className="text-gray-400">×</span>
                      )}
                    </div>
                  </td>

                  <td className="border px-4 py-2">
                    {item.item.discount_price && (
                      <span className="mr-2 rounded bg-blue-100 px-2 py-1 text-xs">
                        ON DISCOUNT
                      </span>
                    )}

                    <span className="font-semibold">
                      ${item.final_price}
                    </span>

                    <button
                      onClick={() =>
                        handleRemoveItem(item.id)
                      }
                      className="ml-4 text-red-600"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={4}></td>
                <td className="border px-4 py-2">
                  <h4 className="font-semibold">
                    Total ${cart.total}
                  </h4>
                  {cart.coupon && (
                    <span className="mt-1 inline-block rounded bg-gray-200 px-2 py-1 text-sm">
                      Coupon: {cart.coupon.code} (-$
                      {cart.coupon.amount})
                    </span>
                  )}
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={4}></td>
                <td className="border px-4 py-4">
                  <Link
                    to="/checkout"
                    className="rounded bg-yellow-500 px-4 py-2 font-semibold text-white"
                  >
                    Proceed to checkout
                  </Link>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        renderAlert()
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.token !== null,
  cart: state.cart.shoppingCart,
  cartError: state.cart.error,
  cartLoading: state.cart.loading,
});

const mapDispatchToProps = (dispatch: any) => ({
  refreshCart: () => dispatch(fetchCart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
