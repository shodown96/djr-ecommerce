import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../axios";
import { checkoutURL } from "../constants";

type Props = {
  selectedBillingAddress: any;
  selectedShippingAddress: any;
  setState: (state: any) => void;
  state: any;
};

const StripeForm: React.FC<Props> = ({
  selectedBillingAddress,
  selectedShippingAddress,
  setState,
  state,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleStripe = (e: FormEvent) => {
    e.preventDefault();

    const form = document.querySelector(
      ".addresses"
    ) as HTMLFormElement | null;

    if (!form) return;

    const valid = form.checkValidity();

    const sa = document.querySelector(
      ".shippingAddress"
    ) as HTMLInputElement | null;

    const ba = document.querySelector(
      ".billingAddress"
    ) as HTMLInputElement | null;

    if (sa?.validity.valueMissing) {
      sa.classList.add("is-invalid");
    }

    if (ba?.validity.valueMissing) {
      ba.classList.add("is-invalid");
    }

    if (!stripe || !elements || !valid) {
      console.error("Stripe is not loaded or Invalid addresses");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    stripe.createToken(cardElement).then((result) => {
      if (result.error) {
        setState({
          ...state,
          error: result.error.message,
          loading: false,
        });
      } else if (result.token) {
        setState({ ...state, loading: true, error: null });

        authAxios
          .post(checkoutURL, {
            stripeToken: result.token.id,
            selectedBillingAddress,
            selectedShippingAddress,
          })
          .then(() => {
            setState({
              ...state,
              loading: false,
              success: true,
              error: false,
            });
            setTimeout(() => navigate("/"), 3000);
          })
          .catch((err) => {
            setState({
              ...state,
              loading: false,
              success: false,
              error: err,
            });
          });
      }
    });
  };

  return (
    <form onSubmit={handleStripe} className="space-y-4">
      <p className="text-sm text-gray-500">
        TEST CARD: 4242 4242 4242 4242 | EXP: 04/24 | CVV: 242 | PIN: 42424
      </p>

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
        className="w-full rounded bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
      >
        Pay
      </button>
    </form>
  );
};

export default StripeForm;
