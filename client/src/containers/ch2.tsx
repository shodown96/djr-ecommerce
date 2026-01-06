import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState, type FormEvent } from "react";
import { connect } from "react-redux";
import { Link, redirect } from "react-router-dom";
import { axiosClient } from "../axios";
import CouponForm from "../components/CouponForm";
import OrderPreview from "../components/OrderPreview";
import {
  API_ENDPOINTS
} from "../constants/api";

type AddressOption = {
  key: string | number;
  text: string;
  value: string | number;
};

type State = {
  loading: boolean;
  error: any;
  success: boolean;
  selectedBillingAddress: string | number;
  selectedShippingAddress: string | number;
};

type Props = {
  authenticated: boolean;
};

const Checkout: React.FC<Props> = ({ authenticated }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    success: false,
    selectedBillingAddress: "",
    selectedShippingAddress: "",
  });

  const [shippingAddresses, setShippingAddresses] = useState<AddressOption[]>(
    []
  );
  const [billingAddresses, setBillingAddresses] = useState<AddressOption[]>([]);

  useEffect(() => {
    handleFetchBillingAddresses();
    handleFetchShippingAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetDefaultAddress = (addresses: any[]) => {
    const defaultAddress = addresses.find((a) => a.default === true);
    return defaultAddress ? defaultAddress.id : "";
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFetchBillingAddresses = () => {
    setState((prev) => ({ ...prev, loading: true }));

    axiosClient
      .get(API_ENDPOINTS.Addresses.ListByAddressType("B"))
      .then((res) => {
        setBillingAddresses(
          res.data.map((a: any) => ({
            key: a.id,
            text: `${a.street_address}, ${a.apartment_address}, ${a.country}`,
            value: a.id,
          }))
        );

        setState((prev) => ({
          ...prev,
          selectedBillingAddress: handleGetDefaultAddress(res.data),
          loading: false,
        }));
      })
      .catch((err) => {
        setState((prev) => ({ ...prev, error: err, loading: false }));
      });
  };

  const handleFetchShippingAddresses = () => {
    setState((prev) => ({ ...prev, loading: true }));

    axiosClient
      .get(API_ENDPOINTS.Addresses.ListByAddressType("S"))
      .then((res) => {
        setShippingAddresses(
          res.data.map((a: any) => ({
            key: a.id,
            text: `${a.street_address}, ${a.apartment_address}, ${a.country}`,
            value: a.id,
          }))
        );

        setState((prev) => ({
          ...prev,
          selectedShippingAddress: handleGetDefaultAddress(res.data),
          loading: false,
        }));
      })
      .catch((err) => {
        setState((prev) => ({ ...prev, error: err, loading: false }));
      });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setState((prev) => ({ ...prev, loading: true }));

    if (!stripe || !elements) {
      console.error("Stripe not loaded");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    stripe.createToken(cardElement).then((result) => {
      if (result.error) {
        setState((prev) => ({
          ...prev,
          error: result.error?.message,
          loading: false,
        }));
      } else if (result.token) {
        axiosClient
          .post(API_ENDPOINTS.Orders.Checkout, {
            stripeToken: result.token.id,
            selectedBillingAddress: state.selectedBillingAddress,
            selectedShippingAddress: state.selectedShippingAddress,
          })
          .then(() => {
            setState((prev) => ({
              ...prev,
              loading: false,
              success: true,
              error: null,
            }));
          })
          .catch((err) => {
            setState((prev) => ({
              ...prev,
              loading: false,
              error: err,
            }));
          });
      }
    });
  };

  const renderAlert = () => {
    if (state.loading) {
      return (
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      );
    }

    if (state.success) {
      return (
        <div className="rounded bg-green-100 p-4 text-green-800">
          <h4 className="font-semibold">Payment Successful</h4>
          <p>Thank you for using our services</p>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="rounded bg-red-100 p-4 text-red-800">
          <h4 className="font-semibold">
            There were some errors with your submission
          </h4>
          <p>{JSON.stringify(state.error)}</p>
        </div>
      );
    }

    return null;
  };

  if (!authenticated) {
    throw redirect("/login")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h3 className="text-2xl font-semibold">Checkout</h3>

      <OrderPreview />
      <CouponForm />

      {renderAlert()}

      <h3 className="text-xl font-semibold">Stripe Payment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {shippingAddresses.length > 0 ? (
          <select
            name="selectedShippingAddress"
            onChange={handleSelectChange}
            required
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Select a shipping address</option>
            {shippingAddresses.map((a) => (
              <option key={a.key} value={a.value}>
                {a.text}
              </option>
            ))}
          </select>
        ) : (
          <p>
            You need to <Link to="/profile">add a shipping address</Link>
          </p>
        )}

        {billingAddresses.length > 0 ? (
          <select
            name="selectedBillingAddress"
            onChange={handleSelectChange}
            required
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Select a billing address</option>
            {billingAddresses.map((a) => (
              <option key={a.key} value={a.value}>
                {a.text}
              </option>
            ))}
          </select>
        ) : (
          <p>
            You need to <Link to="/profile">add a billing address</Link>
          </p>
        )}

        {billingAddresses.length < 1 ||
          shippingAddresses.length < 1 ? (
          <p>
            You need to add addresses before you can complete your
            purchase
          </p>
        ) : (
          <>
            <div className="my-5 rounded border p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!stripe}
              className="w-full rounded bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Pay
            </button>
          </>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  authenticated: state.auth.token !== null,
});

export default connect(mapStateToProps)(Checkout);
