import React, { useEffect, useState } from 'react'

// import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; //Elements,
import { MDBAlert, MDBBtn, MDBContainer } from 'mdbreact';
import { authAxios } from "../utils";
import {
    checkoutURL,
    addressListURL
} from "../constants";
import { Link, Redirect } from 'react-router-dom';
import OrderPreview from '../components/OrderPreview';
import CouponForm from '../components/CouponForm';
import { connect } from 'react-redux';
import { stripeKey } from '../apikeys';


const Checkout = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [state, setState] = useState({
        loading: false,
        error: null,
        success: false,
        // shippingAddresses: [],
        // billingAddresses: [],
        selectedBillingAddress: "",
        selectedShippingAddress: ""
    });
    const [shippingAddresses, setShippingAddresses] = useState()
    const [billingAddresses, setBillingAddresses] = useState()

    useEffect(() => {
        handleFetchBillingAddresses();
        handleFetchShippingAddresses();
        // eslint-disable-next-line
    }, [])

    const handleGetDefaultAddress = addresses => {
        const filteredAddresses = addresses.filter(el => el.default === true);
        if (filteredAddresses.length > 0) {
            return filteredAddresses[0].id;
        }
        return "";
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target
        setState({ ...state, [name]: value });
    };

    const handleFetchBillingAddresses = () => {
        setState({ ...state, loading: true });
        authAxios
            .get(addressListURL("B"))
            .then(res => {
                setBillingAddresses(
                    res.data.map(a => {
                        return {
                            key: a.id,
                            text: `${a.street_address}, ${a.apartment_address}, ${a.country}`,
                            value: a.id
                        };
                    }),

                );
                setState({ ...state, selectedBillingAddress: handleGetDefaultAddress(res.data), loading: false })
            })
            .catch(err => {
                setState({ ...state, error: err, loading: false });
            });
    };

    const handleFetchShippingAddresses = () => {
        setState({ ...state, loading: true });
        authAxios
            .get(addressListURL("S"))
            .then(res => {
                console.log(res.data)
                setShippingAddresses(
                    res.data.map(a => {
                        return {
                            key: a.id,
                            text: `${a.street_address}, ${a.apartment_address}, ${a.country}`,
                            value: a.id
                        };
                    })
                );
                setState({ ...state, selectedShippingAddress: handleGetDefaultAddress(res.data), loading: false })
            })
            .catch(err => {
                setState({ ...state, error: err, loading: false });
            });
    };

    // const handleSubmit = async (event) => {
    //     // Block native form submission.
    //     event.preventDefault();
    //     if (!stripe || !elements) {
    //         // Stripe.js has not loaded yet. Make sure to disable
    //         // form submission until Stripe.js has loaded.
    //         return;
    //     }
    //     // Get a reference to a mounted CardElement. Elements knows how
    //     // to find your CardElement because there can only ever be one of
    //     // each type of element.
    //     const cardElement = elements.getElement(CardElement);
    //     // Use your card Element with other Stripe.js APIs
    //     const m = await stripe.createPaymentMethod({
    //         type: 'card',
    //         card: cardElement,
    //     });
    //     console.log(m)
    //     // if (error) {
    //     //     console.log('[error]', error);
    //     // } else {
    //     //     console.log('[PaymentMethod]', paymentMethod);
    //     // }
    // };

    const handleSubmit = ev => {
        ev.preventDefault();
        setState({ ...state, loading: true });
        if (stripe) {
            const cardElement = elements.getElement(CardElement);
            stripe.createToken(cardElement).then(result => {
                if (result.error) {
                    // console.log(result.error, result.token)
                    setState({ ...state, error: result.error.message, loading: false });
                } else {
                    setState({ ...state, error: null });
                    const {
                        selectedBillingAddress,
                        selectedShippingAddress
                    } = state;
                    // console.log(result.token.id,
                    //     selectedBillingAddress,
                    //     selectedShippingAddress)
                    authAxios
                        .post(checkoutURL, {
                            stripeToken: result.token.id,
                            selectedBillingAddress,
                            selectedShippingAddress
                        })
                        .then(res => {
                            // console.log(res)
                            setState({ ...state, loading: false, success: true, error: false });
                        })
                        .catch(err => {
                            setState({ ...state, loading: false, error: err });
                        });
                }
            });
        } else {
            console.log("Stripe is not loaded");
        }
    };

    const alert = () => {
        if (state.loading) return (
            <div className="mx-auto text-center green-text">
                <div className="spinner-grow" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
        else if (state.success) return (
            <MDBAlert color="success">
                <h4>Payment Successful</h4>
                <p>Thank you for using our services</p>
            </MDBAlert>
        )
        else if (state.error) return (
            <MDBAlert color="danger">
                <h4>There were some errors with your submission</h4>
                <p>{JSON.stringify(state.error)}</p>
            </MDBAlert>
        )


    }
    const {
        error,
        loading,
        success,
        // billingAddresses,
        // shippingAddresses,
        // selectedBillingAddress,
        // selectedShippingAddress
    } = state;

    if (!props.authenticated) { return <Redirect to="/login" /> }

    return (
        <MDBContainer>
            <h3>Checkout</h3>
            <OrderPreview />
            <CouponForm />
            {alert()}
            {/* <MDBTypography variant="h3">Stripe Payment</MDBTypography> */}
            <h3>Stripe Payment</h3>
            {success && (
                <MDBAlert color="success">
                    <h3>Success !!</h3>
                    <p>Your address was saved</p>
                </MDBAlert>
            )}
            {loading && (
                <div className="mx-auto text-center green-text">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {error && (

                <MDBAlert color="danger">
                    <h3>There were some errors with your submission</h3>
                    <p>{JSON.stringify(error.response)}</p>
                </MDBAlert>
            )}
            <form onSubmit={handleSubmit}>

                {shippingAddresses?.length > 0 ?
                    <select name="selectedShippingAddress" className="browser-default custom-select my-2" onChange={handleSelectChange} required>
                        <option>Select a shipping address</option>
                        {shippingAddresses.map((a, i) =>
                            <option value={a.value} key={i}>{a.text}</option>
                        )}
                    </select>
                    : <p>You need to <Link to="/profile">add a shipping address</Link></p>
                }
                {billingAddresses?.length > 0 ?
                    <select name="selectedBillingAddress" className="browser-default custom-select my-2" onChange={handleSelectChange} required>
                        <option>Select a billing address</option>
                        {billingAddresses.map((a, i) =>
                            <option value={a.value} key={i}>{a.text}</option>
                        )}
                    </select>
                    : <p>You need to <Link to="/profile">add a billing address</Link></p>
                }
                {billingAddresses?.length < 1 || shippingAddresses?.length < 1 ? (
                    <p>You need to add addresses before you can complete your purchase</p>
                ) : <>
                        <CardElement className="my-5"
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                        <MDBBtn disabled={!stripe} block type="submit">Pay</MDBBtn>
                    </>
                }
            </form>
        </MDBContainer>
    )
}

const mapStateToProps = (state) => ({
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)



// const stripePromise = loadStripe(stripeKey);

// export const WrappedForm = () => {
//     return (
//         <Elements stripe={stripePromise}>
//             <Checkout />
//         </Elements>
//     );
// };
// export default WrappedForm
