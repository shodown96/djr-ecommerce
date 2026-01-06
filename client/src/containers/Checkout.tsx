import React, { type ChangeEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, redirect } from "react-router-dom";
import { axiosClient } from "../axios";
import CouponForm from "../components/CouponForm";
import OrderPreview from "../components/OrderPreview";
import PaystackForm from "../components/PaystackForm";
import StripeForm from "../components/StripeForm";
import { API_ENDPOINTS } from "../constants/api";
import { fetchCart } from "../store/actions/cart";

type AddressOption = {
    key: string | number;
    text: string;
    value: string | number;
};

type State = {
    loading: boolean;
    error: any;
    success: boolean;
    stripe: boolean;
    selectedBillingAddress: string | number;
    selectedShippingAddress: string | number;
};

type Props = {
    authenticated: boolean;
    cart: any;
    refreshCart: () => void;
};

const Checkout: React.FC<Props> = ({
    authenticated,
    cart,
    refreshCart,
}) => {
    const [state, setState] = useState<State>({
        loading: false,
        error: null,
        success: false,
        stripe: true,
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
        const found = addresses.find((a) => a.default === true);
        return found ? found.id : "";
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
        e.target.classList.remove("is-invalid");
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

    const toggleStripe = () => {
        setState((prev) => ({ ...prev, stripe: !prev.stripe }));
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
            refreshCart();
            return (
                <div className="rounded bg-green-100 p-4 text-green-800">
                    <h4 className="font-semibold">Payment Successful !!</h4>
                    <p>Thank you for using our services.</p>
                </div>
            );
        }

        if (state.error) {
            return (
                <div className="rounded bg-red-100 p-4 text-red-800">
                    <h4 className="font-semibold">
                        There were some errors with your submission
                    </h4>
                    {state.error.response?.data ? (
                        <p>{state.error.response.data.message}</p>
                    ) : (
                        <p>{state.error.message}</p>
                    )}
                </div>
            );
        }

        return null;
    };

    if (!authenticated) throw redirect("/login");
    if (!cart || cart.order_items?.length < 1) throw redirect("/");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-2xl font-semibold">Checkout</h3>

            <OrderPreview />
            <CouponForm />

            <h3 className="text-xl font-semibold">
                {state.stripe ? "Stripe" : "Paystack"} Payment
            </h3>

            {renderAlert()}

            <form className="addresses space-y-3">
                {shippingAddresses.length > 0 ? (
                    <>
                        <select
                            name="selectedShippingAddress"
                            onChange={handleSelectChange}
                            required
                            className="shippingAddress w-full rounded border px-3 py-2"
                        >
                            <option value="">Select a shipping address</option>
                            {shippingAddresses.map((a) => (
                                <option key={a.key} value={a.value}>
                                    {a.text}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-red-500">
                            Please select your shipping address.
                        </p>
                    </>
                ) : (
                    <p>
                        You need to <Link to="/profile">add a shipping address</Link>
                    </p>
                )}

                {billingAddresses.length > 0 ? (
                    <>
                        <select
                            name="selectedBillingAddress"
                            onChange={handleSelectChange}
                            required
                            className="billingAddress w-full rounded border px-3 py-2"
                        >
                            <option value="">Select a billing address</option>
                            {billingAddresses.map((a) => (
                                <option key={a.key} value={a.value}>
                                    {a.text}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-red-500">
                            Please select your billing address.
                        </p>
                    </>
                ) : (
                    <p>
                        You need to <Link to="/profile">add a billing address</Link>
                    </p>
                )}
            </form>

            {billingAddresses.length < 1 || shippingAddresses.length < 1 ? (
                <p>You need to add addresses before you can complete your purchase</p>
            ) : (
                <>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={state.stripe}
                                onChange={toggleStripe}
                            />
                            <span>Stripe</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={!state.stripe}
                                onChange={toggleStripe}
                            />
                            <span>Paystack</span>
                        </label>
                    </div>

                    {state.stripe ? (
                        <StripeForm
                            selectedBillingAddress={state.selectedBillingAddress}
                            selectedShippingAddress={state.selectedShippingAddress}
                            state={state}
                            setState={setState}
                        />
                    ) : (
                        <PaystackForm
                            selectedBillingAddress={state.selectedBillingAddress}
                            selectedShippingAddress={state.selectedShippingAddress}
                            state={state}
                            setState={setState}
                        />
                    )}
                </>
            )}
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
});

const mapDispatchToProps = (dispatch: any) => ({
    refreshCart: () => dispatch(fetchCart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
