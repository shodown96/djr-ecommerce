import PaystackPop from "@paystack/inline-js";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../axios";
import { API_ENDPOINTS } from "../constants/api";


type Props = {
  user: {
    email: string;
  };
  order: {
    total: number | string;
  };
  selectedBillingAddress: any;
  selectedShippingAddress: any;
  setState: (state: any) => void;
  state: any;
};

const PaystackForm: React.FC<Props> = ({
  user,
  order,
  selectedBillingAddress,
  selectedShippingAddress,
  setState,
  state,
}) => {
  const navigate = useNavigate();

  const handlePaystack = async () => {
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

    if (!valid) return;

    const popup = new PaystackPop();
    console.log(import.meta.env.PAYSTACK_PUBLIC_KEY!)
    await popup.checkout({
      key: import.meta.env.PAYSTACK_PUBLIC_KEY!,
      email: user.email,
      amount: Number(order.total) * 381.5 * 100,

      onSuccess: (res: any) => {
        setState({ ...state, loading: true, error: null });

        axiosClient
          .post(API_ENDPOINTS.Paystack.Receive, {
            ...res,
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
          .catch((e) => {
            setState({
              ...state,
              loading: false,
              success: false,
              error: e,
            });
          });
      },

      onError: () => {
        alert("Wait! You need this oil, don't go!!!!");
      },

      onCancel: () => {
        alert("Wait! You need this oil, don't go!!!!");
      },
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePaystack}
        className="w-full rounded bg-green-600 px-4 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
      >
        Pay Now
      </button>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  order: state.cart.shoppingCart,
  user: state.auth.user,
});

export default connect(mapStateToProps)(PaystackForm);
