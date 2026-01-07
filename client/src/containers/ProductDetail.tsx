import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "../axios";
import {
  API_ENDPOINTS,
  BASE_API_URL
} from "../constants/api";
import { fetchCart } from "../store/actions/cart";
import ErrorPage from "./ErrorPage";

type Props = {
  token: string | null;
  cart: any;
  refreshCart: () => void;
};

const ProductDetail: React.FC<Props> = ({
  token,
  cart,
  refreshCart,
}) => {
  const navigate = useNavigate();
  const { productID } = useParams<{ productID: string }>();

  const [state, setState] = useState({
    loading: false,
    error: null as any,
    success: false,
    formVisible: false,
    data: null as any,
    formData: {} as Record<string, number>,
  });

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    handleFetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchItem = () => {
    setState((s) => ({ ...s, loading: true }));

    axiosClient
      .get(API_ENDPOINTS.Products.Detail(productID!))
      .then((res) => {
        setState((s) => ({
          ...s,
          data: res.data.data,
          loading: false,
        }));
        setNotFound(false);
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          error: err,
          loading: false,
        }));
        setNotFound(true);
      });
  };

  const handleToggleForm = () => {
    setState((s) => ({ ...s, formVisible: !s.formVisible }));
  };

  const handleFormatData = (formData: Record<string, number>) =>
    Object.keys(formData).map((key) => formData[key]);

  const handleAddToCart = (
    e: React.FormEvent,
    slug: string
  ) => {
    e.preventDefault();
    if (!token) return navigate("/sign-in");

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
      success: false,
    }));

    const variations = handleFormatData(state.formData);

    axiosClient
      .post(API_ENDPOINTS.Orders.AddToCart, { slug, variations })
      .then(() => {
        refreshCart();
        setState((s) => ({
          ...s,
          loading: false,
          success: true,
        }));
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: err,
        }));
      });
  };

  const handleNormalAddToCart = (slug: string) => {
    if (!token) return navigate("/sign-in");

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
      success: false,
    }));

    axiosClient
      .post(API_ENDPOINTS.Orders.AddToCart, { slug })
      .then(() => {
        refreshCart();
        setState((s) => ({
          ...s,
          loading: false,
          success: true,
        }));
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: err,
        }));
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((s) => ({
      ...s,
      formData: {
        ...s.formData,
        [name]: Number(value),
      },
    }));
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

  const { data: item, error, loading, success } = state;

  if (notFound) return <ErrorPage />;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {error && item && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-800">
          <h4 className="font-semibold">
            There were some errors with your submission
          </h4>
          <p>
            {error.response?.data?.message ||
              error.message}
          </p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      )}

      {success && (
        <div className="mb-4 rounded bg-green-100 p-4 text-green-800">
          <h4 className="font-semibold">
            The item has been added to cart
          </h4>
          <p>Continue shopping.</p>
        </div>
      )}

      {item && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={`${BASE_API_URL}${item.image}`}
            alt={item.title}
            className="rounded shadow"
          />

          <div>
            <h3 className="text-2xl font-bold">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 uppercase">
              {item.category}
            </p>

            <div className="my-2">
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

            <p className="mb-4">{item.description}</p>

            {item.variations?.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold mb-2">
                  Specify your variations
                </h5>

                {item.variations.map((v: any, i: number) => (
                  <div key={i} className="mb-3">
                    <h6 className="font-medium">
                      {v.name}
                    </h6>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {v.item_variations.map(
                        (iv: any, idx: number) => (
                          <div
                            key={idx}
                            className="rounded border p-2 text-center text-sm"
                          >
                            {iv.value}
                            {iv.attachment && (
                              <img
                                src={iv.attachment}
                                alt=""
                                className="mt-1 rounded"
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {item.variations?.length > 0 ? (
              <button
                onClick={handleToggleForm}
                className="w-full rounded bg-gray-900 py-2 text-white"
              >
                Add to Cart
              </button>
            ) : (
              <button
                onClick={() =>
                  handleNormalAddToCart(item.slug)
                }
                className="w-full rounded bg-gray-900 py-2 text-white"
              >
                Add to Cart
              </button>
            )}

            {state.formVisible && (
              <form
                onSubmit={(e) =>
                  handleAddToCart(e, item.slug)
                }
                className="mt-4 space-y-2"
              >
                {item.variations.map(
                  (v: any, i: number) => (
                    <select
                      key={i}
                      name={v.name.toLowerCase()}
                      onChange={handleChange}
                      required
                      className="w-full rounded border px-3 py-2 transition"
                    >
                      <option value="">
                        {v.name}
                      </option>
                      {v.item_variations.map(
                        (iv: any, idx: number) => (
                          <option
                            key={idx}
                            value={iv.id}
                          >
                            {iv.value}
                          </option>
                        )
                      )}
                    </select>
                  )
                )}

                <button
                  type="submit"
                  className="w-full rounded bg-green-600 py-2 text-white"
                >
                  Add to Cart
                </button>
              </form>
            )}

            {checkInCart(item.id) && (
              <button
                onClick={() =>
                  handleRemoveItem(item.id)
                }
                className="mt-3 w-full rounded bg-red-600 py-2 text-white"
              >
                Remove from Cart
              </button>
            )}
          </div>
        </div>
      )}
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
)(ProductDetail);
