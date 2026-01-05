import React, { ChangeEvent, FormEvent, useState } from "react";
import { connect } from "react-redux";
import { authAxios } from "../axios";
import { addCouponURL } from "../constants";
import { fetchCart } from "../store/actions/cart";

type Props = {
  refreshCart: () => void;
};

type State = {
  loading: boolean;
  error: any;
  success: boolean;
};

const CouponForm: React.FC<Props> = ({ refreshCart }) => {
  const [code, setCode] = useState<string>("");
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAddCoupon(code);
    setCode("");
  };

  const handleAddCoupon = (couponCode: string) => {
    setState({ loading: true, success: false, error: null });

    authAxios
      .post(addCouponURL, { code: couponCode })
      .then(() => {
        setState({ loading: false, success: true, error: null });
        refreshCart();
      })
      .catch((err) => {
        setState({ loading: false, success: false, error: err });
        setTimeout(
          () =>
            setState((prev) => ({
              ...prev,
              error: null,
            })),
          3000
        );
      });
  };

  const { loading, error, success } = state;

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-3">
      <h4 className="text-lg font-semibold">Apply coupon code</h4>

      {success && (
        <div className="rounded-md bg-green-100 p-4 text-green-800">
          <h3 className="font-semibold">Success !!</h3>
          <p>Your coupon was saved.</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-100 p-4 text-red-800">
          <h3 className="font-semibold">
            There were some errors with your submission
          </h3>
          {error.response?.data ? (
            <p>This coupon has either expired or doesn't exist.</p>
          ) : (
            <p>{error.message}</p>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Code"
        value={code}
        onChange={handleChange}
        className="w-full rounded border px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        Apply
      </button>
    </form>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  refreshCart: () => dispatch(fetchCart()),
});

export default connect(null, mapDispatchToProps)(CouponForm);
