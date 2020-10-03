// import { MDBBtn, MDBInput, MDBRow, MDBCol } from 'mdbreact'
// import React, { useState } from 'react'
// import { PaystackChargeURL } from '../constants'
// import { authAxios } from '../utils'

// function PaystackForm(props) {
//     const { selectedBillingAddress, selectedShippingAddress, setState, state } = props
//     const [cardInfo, setCardInfo] = useState({
//         email: "",
//         amount: "",
//         cvv: "",
//         number: "",
//         expiry_month: "01",
//         expiry_year: "99",
//         pin: ""
//     })

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         if (name !== "exp") {
//             setCardInfo({
//                 ...cardInfo,
//                 [name]: value
//             })
//         }
//         else {
//             const arr = value.split("/")
//             console.log(arr.length)
//             if (arr.length > 1) {
//                 const month = arr[0]
//                 const year = arr[1]
//                 setCardInfo({
//                     ...cardInfo,
//                     expiry_month: month,
//                     expiry_year: year
//                 })

//                 setState({ ...state, error: null })
//             }
//             else {
//                 setState({ ...state, error: "Expiry date error, please insert Card expiry in xx/xx format" })
//                 e.target.valid = false
//             }
//         }
//     }

//     const handlePaystack = (e) => {
//         e.preventDefault()
//         let valid = document.querySelector(".addresses").checkValidity()
//         const sa = document.querySelector(".shippingAddress");
//         const ba = document.querySelector(".billingAddress")
//         if (sa.validity.valueMissing) {
//             sa.classList.add("is-invalid")

//         }
//         if (ba.validity.valueMissing) {
//             ba.classList.add("is-invalid")
//         }
//         console.log(valid)
//         if (valid) {
//             setState({ ...state, loading: true, error: null });

//             authAxios
//                 .post(PaystackChargeURL, {
//                     ...cardInfo,
//                     selectedBillingAddress,
//                     selectedShippingAddress
//                 })
//                 .then(res => {
//                     setState({ ...state, loading: false, success: true, error: false });
//                 })
//                 .catch(err => {
//                     setState({ ...state, loading: false, error: e, success: false });
//                 });
//         }
//     }

//     return (
//         <form onSubmit={handlePaystack} className="needs-valiation">
//             <MDBInput label="Email" placeholder="vhf" valueDefault={cardInfo.email} name="email" onChange={handleChange} required />
//             <MDBInput label="Card Number" name="number" onChange={handleChange} valueDefault={cardInfo.number} required />
//             <MDBRow>
//                 <MDBCol><MDBInput name="exp" error="min" label="Card Expiry" valueDefault={cardInfo.expiry_month + "/" + cardInfo.expiry_year} onChange={handleChange} required /></MDBCol>
//                 <MDBCol><MDBInput name="cvv" label="CVV" valueDefault={cardInfo.cvv} onChange={handleChange} required /></MDBCol>
//             </MDBRow>
//             <MDBInput name="pin" label="Pin" type="password" valueDefault={cardInfo.pin} onChange={handleChange} required />
//             <MDBBtn type="submit" block>Pay Now</MDBBtn>

//         </form>
//     )
// }

// export default PaystackForm


import React from 'react'
import { usePaystackPayment } from 'react-paystack'
import { paystackKey, PaystackReceiveURL } from '../constants'
import { connect } from 'react-redux'
import { authAxios } from '../utils'
import { MDBBtn } from 'mdbreact'
import { useHistory } from 'react-router-dom'

function PaystackForm(props) {
    const { user, order, selectedBillingAddress, selectedShippingAddress, setState, state } = props
    const history = useHistory()
    const config = {
        email: user.email,
        amount: ((Number(order.total) * 381.50) * 100),
        publicKey: paystackKey,
        text: "Pay Now",
    }
    const componentProps = {
        ...config,
        onSuccess: (res) => {
            // alert("Thanks for doing business with us! Come back soon!!");
            // console.log(res);
            setState({ ...state, loading: true, error: null });
            authAxios.post(PaystackReceiveURL, {
                ...res,
                selectedBillingAddress,
                selectedShippingAddress
            })
                .then((r) => {
                    // console.log(r)
                    setState({ ...state, loading: false, success: true, error: false });
                    setTimeout(() => history.replace("/"), 3000)
                })
                .catch((e) => {
                    setState({ ...state, loading: false, error: e, success: false });
                })
            return
        },
        onClose: (res) => {
            alert("Wait! You need this oil, don't go!!!!");
        },
    }

    const initializePayment = usePaystackPayment(config);

    const handlePaystack = () => {
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
        if (valid) { initializePayment((res) => componentProps.onSuccess(res), (res) => componentProps.onClose(res)) }
    }
    return (
        <div>
            {/* <PaystackButton {...componentProps} className="btn btn-default btn-block" /> */}
            <MDBBtn block onClick={handlePaystack}>Pay Now</MDBBtn>
        </div>
    )
}
const mapStateToProps = (state) => ({
    order: state.cart.shoppingCart,
    user: state.auth.user
})

export default connect(mapStateToProps)(PaystackForm) 
