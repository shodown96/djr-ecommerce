import React, { useEffect, useState } from 'react'

import { MDBAlert, MDBContainer } from 'mdbreact';
import { authAxios } from "../utils";
import { addressListURL } from "../constants";
import { Link, Redirect } from 'react-router-dom';
import OrderPreview from '../components/OrderPreview';
import CouponForm from '../components/CouponForm';
import { connect } from 'react-redux';
import StripeForm from '../components/StripeForm';
import PaystackForm from '../components/PaystackForm';
import { fetchCart } from '../store/actions/cart';
// import "../components/FormValidation"

const Checkout = (props) => {
    const [state, setState] = useState({
        loading: false,
        error: null,
        success: false,
        stripe: true,
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
        e.target.classList.remove("is-invalid")
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

    const toggleStripe = () => {
        const { stripe } = state
        setState({ ...state, stripe: !stripe })
    }

    const handleSubmit = e => {
        e.preventDefault()
    }


    const {
        error,
        loading,
        success,
        selectedBillingAddress,
        selectedShippingAddress,
        stripe,
    } = state;


    const alert = () => {
        if (loading) return (
            <div className="mx-auto text-center green-text">
                <div className="spinner-grow" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
        else if (success) return (
            <MDBAlert color="success">
                <h4>Payment Successful !!</h4>
                <p>Thank you for using our services.</p>
                {props.refreshCart()}
            </MDBAlert>
        )
        else if (error) return (
            <MDBAlert color="danger">
                <h4>There were some errors with your submission</h4>
                {error.response && error.response.data ? <p>{error.response.data.message}</p> :
                    <p>{error.message}</p>}

            </MDBAlert>
        )


    }

    // const [billingError, setBillingError] = useState()
    // const [shippingError, setShippingError] = useState()

    if (!props.authenticated) { return <Redirect to="/login" /> }
    if (props.cart?.order_items.length < 1 || props.cart === undefined || props.cart === null) { return <Redirect to="/" /> }


    return (
        <MDBContainer>
            <h3>Checkout</h3>
            <OrderPreview />
            <CouponForm />
            <h3>{stripe ? "Stripe" : "Paystack"} Payment</h3>
            {alert()}

            <form onSubmit={handleSubmit} className="addresses needs-validation">

                {shippingAddresses?.length > 0 ?
                    <>
                        <select name="selectedShippingAddress" className="browser-default custom-select my-2 shippingAddress" onChange={handleSelectChange} valueDefault={selectedBillingAddress} required>
                            <option value="">Select a shipping address</option>
                            {shippingAddresses.map((a, i) =>
                                <option value={a.value} key={i}>{a.text}</option>
                            )}
                        </select>
                        <p className="invalid-feedback my-0"> Please select your shipping address. </p>
                    </>
                    : <p>You need to <Link to="/profile">add a shipping address</Link></p>
                }
                {billingAddresses?.length > 0 ?
                    <>
                        <select name="selectedBillingAddress" className="browser-default custom-select my-2 billingAddress" onChange={handleSelectChange} valueDefault={selectedShippingAddress} required>
                            <option value="">Select a billing address</option>
                            {billingAddresses.map((a, i) =>
                                <option value={a.value} key={i}>{a.text}</option>
                            )}
                        </select>
                        <p className="invalid-feedback"> Please select your billing address. </p>
                    </>
                    : <p>You need to <Link to="/profile">add a billing address</Link></p>
                }

            </form>
            {billingAddresses?.length < 1 || shippingAddresses?.length < 1 ? (
                <p>You need to add addresses before you can complete your purchase</p>
            ) : <>
                    <div className="mb-4 text-left">

                        <div className="custom-control custom-radio">
                            <input type="radio" className="custom-control-input" id="default" onChange={toggleStripe} checked={stripe} />
                            <label className="custom-control-label" htmlFor="default">Stripe</label>
                        </div>
                        <div className="custom-control custom-radio">
                            <input type="radio" className="custom-control-input" id="default1" onChange={toggleStripe} checked={!stripe} />
                            <label className="custom-control-label" htmlFor="default1">Paystack</label>
                        </div>
                    </div>

                    {stripe ?
                        <StripeForm
                            selectedBillingAddress={selectedBillingAddress}
                            selectedShippingAddress={selectedShippingAddress}
                            state={state} setState={setState}
                        /> :
                        <PaystackForm
                            selectedBillingAddress={selectedBillingAddress}
                            selectedShippingAddress={selectedShippingAddress}
                            state={state} setState={setState}
                        />
                    }
                </>
            }
        </MDBContainer>
    )
}

const mapStateToProps = (state) => ({
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
})

const mapDispatchToProps = dispatch => {
    return {
        refreshCart: () => dispatch(fetchCart())
    }
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
