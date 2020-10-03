import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import axios from "axios"
import { authAxios } from "../utils"
import { fetchCart } from "../store/actions/cart";
import { productListURL, addToCartURL, orderItemDeleteURL } from "../constants";
import { MDBBtn, MDBContainer, MDBIcon } from 'mdbreact';
import { Link } from 'react-router-dom';

const ProductList = (props) => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchProducts()
        //eslint-disable-next-line
    }, [])

    const fetchProducts = () => {
        setLoading(true)
        axios.get(productListURL)
            .then((r) => {
                setItems(r.data);
                setLoading(false);

            })
            .catch((e) => { console.error(e); console.log(e.response); setLoading(false) })
    }

    const handleAddToCart = (slug) => {
        if (!props.token) return props.history.push("/login")
        authAxios.post(addToCartURL, { slug })
            .then((r) => {
                // console.log(r.data);
                props.refreshCart();
                setLoading(false);

            })
            .catch((e) => { console.error(e); console.log(e.response); setLoading(false) })
    }

    const handlePushToDetails = (id) => {
        props.history.push("/products/" + id)
    }

    const handleLoading = () => {
        if (loading) {
            return (
                <div className="mx-auto text-center">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
        else { return (<h4 className="text-center mx-auto text-black-50">Items unavailable, please check your server</h4>) }
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

    return (
        <MDBContainer>
            {items ? items.map((item, i) =>
                <section key={i}>
                    <div className="row mb-4">
                        <div className="col-md-5 col-lg-3 col-xl-3">
                            <div className="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">
                                <img className="img-fluid w-100 p-2"
                                    src={item.image}
                                    alt={item.title} />
                                <Link to={"products/" + item.id}>
                                    <div className="mask">
                                        <img className="img-fluid w-100 p-2"
                                            src={item.image} alt={item.title} />
                                        <div className="mask rgba-black-slight"></div>
                                    </div>
                                </Link>
                            </div>

                        </div>
                        <div className="col-md-7 col-lg-9 col-xl-9">
                            <div className="row">
                                <div className="col-lg-7 col-xl-7">

                                    <h5>{item.title}</h5>
                                    <p className="mb-2 text-muted text-uppercase small">Shirts</p>
                                    <hr />
                                    <p className="mb-lg-0">{item.description.slice(0, 180) + "..."}</p>

                                </div>
                                <div className="col-lg-5 col-xl-5">

                                    <h6 className="mb-2">
                                        {/* ${item.price} */}
                                        {item.discount_price ?
                                            <><span className="text-danger mr-1"><strong>${item.discount_price}</strong></span><span className="text-grey"><strong><s>${item.price}</s></strong></span></>
                                            : <span>${item.price}</span>}
                                    </h6>
                                    <div className="my-2">
                                        <MDBBtn color="default" size="md" className="mr-1 mb-2"
                                            onClick={item.variations ? () => handlePushToDetails(item.id) : () => handleAddToCart(item.slug)}><MDBIcon icon="shopping-cart" className="white-text pr-2" />Add to cart</MDBBtn>
                                    </div>
                                    <MDBBtn color="light" size="md" className="mr-1 mb-2" onClick={() => props.history.push("/products/" + item.id)}> <MDBIcon icon="info-circle" className="pr-2" />Details</MDBBtn>
                                    {checkInCart(item.id) &&
                                        <MDBBtn color="danger" size="md" onClick={() => { handleRemoveItem(item.id) }} className="btn-md px-3 mb-lg-2"><MDBIcon icon="trash" className="white-text" /></MDBBtn>}

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : handleLoading()}
        </MDBContainer>
    )
}

const mapStateToProps = (state) => ({
    token: state.auth.token,
    cart: state.cart.shoppingCart
})
// export default ProductList
const mapDispatchToProps = dispatch => {
    return {
        refreshCart: () => dispatch(fetchCart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
