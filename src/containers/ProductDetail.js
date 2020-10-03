import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { MDBContainer, MDBRow, MDBCol, MDBAlert, MDBBtn, MDBAnimation, MDBIcon } from 'mdbreact'
import axios from "axios";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import { productDetailURL, addToCartURL, orderItemDeleteURL } from "../constants";
import ErrorPage from './ErrorPage';

const ProductDetail = (props) => {
    const [state, setState] = useState({
        loading: false,
        error: null,
        formVisible: false,
        data: null,
        formData: {}
    })

    useEffect(() => {
        handleFetchItem();
        //eslint-disable-next-line
    }, [])

    const handleToggleForm = () => {
        const { formVisible } = state;
        setState({
            ...state, formVisible: !formVisible
        });
    };

    const handleFetchItem = () => {
        const {
            match: { params }
        } = props;
        setState({ ...state, loading: true });
        axios
            .get(productDetailURL(params.productID))
            .then(res => {
                setState({ ...state, data: res.data, loading: false });
            })
            .catch(err => {
                setState({ ...state, error: err, loading: false });
            });
    };

    const handleFormatData = formData => {
        // convert {colour: 1, size: 2} to [1,2] - they're all variations
        // if(formData === {}){}
        return Object.keys(formData).map(key => {
            return formData[key];
        });
    };

    const handleAddToCart = (e, slug) => {
        e.preventDefault()
        if (!props.token) { return props.history.push("/login") }
        setState({ ...state, loading: true, eroor: false, success: false });
        const { formData } = state;

        const variations = handleFormatData(formData);
        authAxios
            .post(addToCartURL, { slug, variations })
            .then(res => {
                props.refreshCart();
                setState({ ...state, loading: false, success: true, error: false });

            })
            .catch(err => {
                console.log(err)
                setState({ ...state, loading: false, success: false, error: err });
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        const { formData } = state;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setState({ ...state, formData: updatedFormData });
    };

    const handleNormalAddToCart = (slug) => {
        if (!props.token) return props.history.push("/login")
        setState({ ...state, loading: true, eroor: false, success: false });
        authAxios.post(addToCartURL, { slug })
            .then((r) => {
                // console.log(r.data);
                props.refreshCart();
                setState({ ...state, loading: false, success: true, error: false });

            })
            .catch((e) => {
                // console.error(e); console.log(e.response);
                setState({ ...state, error: e, loading: false, success: false });
            })
    }

    const checkInCart = (id) => {
        if (props.cart && props.cart.order_items.length > 0) {
            const item = props.cart.order_items.find(item => item.item.id === id)
            if (item !== undefined) {
                return true
            }
        }
        return false
    }

    const handleRemoveItem = itemID => {

        const id = getOrderItem(itemID)
        authAxios.delete(orderItemDeleteURL(id))
            .then(res => {
                props.refreshCart()
            })
            .catch(err => {
                console.log(err);
            });
    };

    const getOrderItem = id => props.cart.order_items.find(item => item.item.id === id).id

    const item = state.data;

    const { error, loading, success } = state;

    return (
        <MDBContainer className="">
            {error && item !== null && (
                <MDBAlert color="danger">
                    <h4>There were some errors with your submission</h4>
                    {error.response && error.response.data ? <p>{error.response.data.message}</p> :
                        <p>{error.message}</p>}
                </MDBAlert>
            )}
            {loading && (
                <div className="mx-auto text-center green-text">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {success && (
                <MDBAlert color="success">
                    <h4>The item has been added to cart</h4>
                    <p>Continue shopping.</p>
                </MDBAlert>
            )}
            {item && !loading ?

                <MDBRow className="w-100">
                    <MDBCol md="6" className="mb-2">
                        <img src={item.image} alt="" className="img-fluid z-depth-1" />
                    </MDBCol>
                    <MDBCol md="5" className="offset-md-1">
                        <h3 className="font-weight-bold">{item.title}</h3>
                        <p className="mb-2 text-muted text-uppercase small">{item.category}</p>
                        {/* <h4 className="font-weight-bolder">${item.price}</h4> */}
                        <h6 className="mb-2">
                            {/* ${item.price} */}
                            {item.discount_price ?
                                <><span className="text-danger mr-1"><strong>${item.discount_price}</strong></span><span className="text-grey"><strong><s>${item.price}</s></strong></span></>
                                : <span>${item.price}</span>}
                        </h6>
                        <p>{item.description}</p>
                        <MDBRow className="mb-2">
                            {item.variations?.length > 0 &&
                                <MDBCol lg="12">
                                    <h5 className="font-weight-bolder">Specify your variations</h5>
                                    <div className="">
                                        {item.variations?.map((v, i) => {
                                            return (
                                                <div key={i}>
                                                    <h5 className="font-weight-bolder">{v.name}</h5>
                                                    <div key={i} className="row">
                                                        {v.item_variations.map((iv, i) =>
                                                            <div className="col-lg-4 mb-2" key={i}>
                                                                <p className="mb-2 p-2 badge badge-default">{iv.value}</p>
                                                                {iv.attachment && <img src={`${iv.attachment}`} alt="" className="img-fluid z-depth-1 p-1" />}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </MDBCol>
                            }
                        </MDBRow>

                        {item.variations?.length > 0 ?
                            <MDBBtn className="mx-0" block onClick={handleToggleForm}>Add to Cart</MDBBtn>
                            : <MDBBtn className="mx-0" block onClick={() => handleNormalAddToCart(item.slug)}>Add to Cart</MDBBtn>
                        }

                        {state.formVisible && (
                            <form onSubmit={(e) => handleAddToCart(e, item.slug)}>
                                {item.variations?.map((v, i) => {
                                    const name = v.name.toLowerCase();
                                    return (
                                        <MDBAnimation type="fadeIn" key={i}>
                                            <select className="browser-default custom-select my-2"
                                                name={name} //value={state.formData && state.formData[name]}
                                                onChange={handleChange} required>
                                                <option>{v.name}</option>
                                                {v.item_variations.map((item, i) =>
                                                    <option value={item.id} key={i}>{item.value}</option>
                                                )}
                                            </select>
                                        </MDBAnimation>
                                    );
                                })}
                                <MDBBtn type="submit" block>Add to Cart</MDBBtn>
                            </form>
                        )}
                        {checkInCart(item.id) &&
                            <MDBBtn color="danger" className="mt-2 ml-0" onClick={() => { handleRemoveItem(item.id) }} block><MDBIcon icon="trash" className="white-text" /></MDBBtn>}

                    </MDBCol>
                </MDBRow>
                : <ErrorPage />}
        </MDBContainer>
    )
}
const mapStateToProps = (state) => ({
    token: state.auth.token,
    cart: state.cart.shoppingCart
})

const mapDispatchToProps = dispatch => {
    return {
        refreshCart: () => dispatch(fetchCart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail)
