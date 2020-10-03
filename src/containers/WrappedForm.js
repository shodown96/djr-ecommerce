import React from "react"
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'; //
import Checkout from "./Checkout"
import { stripeKey } from "../constants";

const stripePromise = loadStripe(stripeKey);

const WrappedForm = () => {
    return (
        <Elements stripe={stripePromise}>
            <Checkout />
        </Elements>
    );
};

export default WrappedForm