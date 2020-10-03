import React, { useState } from 'react'
import { MDBInput, MDBBtn, MDBAlert } from "mdbreact"
import { addCouponURL } from "../constants";
import { authAxios } from "../utils";
import { connect } from 'react-redux'
import { fetchCart } from '../store/actions/cart';


const CouponForm = (props) => {
    const [code, setCode] = useState();

    const [state, setState] = useState({
        loading: false,
        error: null,
        success: false
    });

    const handleChange = e => {
        setCode(e.target.value)
    };

    const handleSubmit = e => {
        e.preventDefault()
        handleAddCoupon(e, code);
        setCode("")
    };

    const handleAddCoupon = (e, code) => {
        e.preventDefault();
        setState({
            loading: true, success: true
        });
        authAxios
            .post(addCouponURL, { code })
            .then(res => {
                setState({
                    loading: false, success: true
                });
                // handleFetchOrder();
                props.refreshCart()
            })
            .catch(err => {
                setState({
                    error: err, loading: false
                });
                setTimeout(() => setState({ ...state, error: null }), 3000);
            });
    };
    const { loading, error, success } = state
    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h4>Apply coupon code</h4>
            {success && (
                <MDBAlert color="success">
                    <h3>Success !!</h3>
                    <p>Your coupon was saved.</p>
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
                    {error.response && error.response.data ? <p>This coupon has either expired or doesn't exist.</p> :
                        <p>{error.message}</p>}
                </MDBAlert>
            )}
            <MDBInput label="Code" value={code} onChange={handleChange} />
            <MDBBtn type="submit">Apply</MDBBtn>
        </form>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        refreshCart: () => dispatch(fetchCart())
    }
}

export default connect(null, mapDispatchToProps)(CouponForm)
