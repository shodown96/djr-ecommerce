import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from "../envs";
import Checkout from "./Checkout";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const WrappedForm = () => {
    return (
        <Elements stripe={stripePromise}>
            <Checkout />
        </Elements>
    );
};

export default WrappedForm