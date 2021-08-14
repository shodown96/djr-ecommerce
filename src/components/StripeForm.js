import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; //Elements,
import { MDBBtn } from "mdbreact"
import { authAxios } from "../utils";
import { checkoutURL } from "../constants";
import React from 'react'
import { useHistory } from 'react-router-dom';

function StripeForm(props) {
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory()
    const { selectedBillingAddress, selectedShippingAddress, setState, state } = props


    const handleStripe = (e) => {
        e.preventDefault()
        let valid = document.querySelector(".addresses").checkValidity()
        const sa = document.querySelector(".shippingAddress");
        const ba = document.querySelector(".billingAddress")
        if (sa.validity.valueMissing) {
            sa.classList.add("is-invalid")

        }
        if (ba.validity.valueMissing) {
            ba.classList.add("is-invalid")
        }
        console.log(valid)

        if (stripe && valid) {
            const cardElement = elements.getElement(CardElement);
            stripe.createToken(cardElement).then(result => {
                if (result.error) {
                    // console.log(result.error, result.token)
                    setState({ ...state, error: result.error.message, loading: false });
                } else {
                    setState({ ...state, loading: true, error: null });

                    // console.log(selectedBillingAddress, selectedShippingAddress)
                    // console.log(result.token)
                    authAxios
                        .post(checkoutURL, {
                            stripeToken: result.token.id,
                            selectedBillingAddress,
                            selectedShippingAddress
                        })
                        .then(res => {
                            setState({ ...state, loading: false, success: true, error: false });
                            setTimeout(() => history.replace("/"), 3000)
                        })
                        .catch(err => {
                            setState({ ...state, loading: false, error: err, success: false });
                        });
                }
            });
        } else {
            console.error("Stripe is not loaded or Invalid addresses");
        }
    }
    return (
        <form onSubmit={handleStripe} className="needs-valiation">
            <p className="text-muted">TEST CARD: 4242 4242 4242 4242 || EXP:04/24 || CVV:242 || PIN:42424</p>
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
        </form>
    )
}

export default StripeForm
