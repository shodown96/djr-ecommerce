import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom"
import { authAxios } from "../utils"
import {
    addToCartURL,
    // orderSummaryURL,
    orderItemDeleteURL,
    orderItemUpdateQuantityURL
} from "../constants"
import { MDBAlert, MDBBadge, MDBBtn, MDBContainer, MDBIcon, MDBTable, MDBTableBody, MDBTableFoot, MDBTableHead, MDBTypography } from 'mdbreact';
import { Link } from 'react-router-dom';
import { fetchCart } from "../store/actions/cart";

const OrderSummary = (props) => {

    const [state, setState] = useState({
        // data: [],
        error: null,
        loading: false
    })

    // useEffect(() => {
    //     handleFetchOrder()
    //     // eslint-disable-next-line
    // }, [])
    // const handleFetchOrder = () => {
    //     setState({ ...state, loading: true });
    //     authAxios.get(orderSummaryURL)
    //         .then(res => {
    //             console.log(res.data)
    //             setState({ ...state, data: res.data, loading: false });
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //             if (err.response.status === 404) {
    //                 setState({
    //                     ...state,
    //                     error: "You currently do not have an order",
    //                     loading: false
    //                 });
    //             } else {
    //                 setState({ ...state, error: err, loading: false });
    //             }
    //         });
    // };

    const renderVariations = orderItem => {
        let text = "";
        orderItem.item_variations.forEach(iv => {
            text += `${iv.variation.name}: ${iv.value}, `;
        });
        return text;
    };

    const handleFormatData = itemVariations => {
        // convert [{id: 1},{id: 2}] to [1,2] - they're all variations
        return Object.keys(itemVariations).map(key => {
            return itemVariations[key].id;
        });
    };

    const handleAddToCart = (slug, itemVariations) => {
        setState({ loading: true });
        const variations = handleFormatData(itemVariations);
        authAxios.post(addToCartURL, { slug, variations })
            .then(res => {
                // handleFetchOrder();
                props.refreshCart()
                setState({ loading: false });
            })
            .catch(err => {
                setState({ error: err, loading: false });
            });
    };

    const handleRemoveQuantityFromCart = slug => {
        authAxios.post(orderItemUpdateQuantityURL, { slug })
            .then(res => {
                // handleFetchOrder();
                props.refreshCart()
            })
            .catch(err => {
                setState({ error: err });
            });
    };

    const handleRemoveItem = itemID => {
        authAxios.delete(orderItemDeleteURL(itemID))
            .then(res => {
                // handleFetchOrder();
                props.refreshCart()
            })
            .catch(err => {
                setState({ error: err });
            });
    };

    const renderAlert = () => {
        if (props.cartLoading) {
            return (
                <div className="mx-auto text-center green-text">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
        else if (props.cartError) {
            return (
                <MDBAlert color="danger" className="border text-white darken-5">
                    <h4>Cart Error</h4>
                    <p>{props.cartError.response.data}</p>
                </MDBAlert>
            )
        }
        return (
            <MDBAlert color="dark" className="border text-white darken-5">
                <h4>Cart Empty</h4>
                <p>You don't have an active cart</p>
            </MDBAlert>
        )
    }

    // const { data } = state
    const data = props.cart

    if (!props.isAuthenticated) {
        return <Redirect to="/login" />;
    }

    const { error } = state;

    return (
        <MDBContainer>
            <MDBTypography variant="h3">Order Summary</MDBTypography>
            {error && (
                <MDBAlert color="danger">
                    <h3>There were some errors with your submission</h3>
                    {error.response && error.response.data ? <p>{JSON.stringify(error.response.data)}</p> :
                        <p>{error.message}</p>}
                </MDBAlert>
            )}
            {data ?
                <MDBTable responsive hover>
                    <MDBTableHead>
                        <tr>
                            <th>Item #</th>
                            <th>Item name</th>
                            <th>Item price</th>
                            <th className="text-center">Item quantity</th>
                            <th>Total item price</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {data?.order_items?.length > 0 && data?.order_items?.map((item, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{item.item.title} {renderVariations(item)}</td>
                                <td className="font-weight-bolder">${item.item.price}</td>
                                <td className="d-flex justify-content-around align-items-center">
                                    <MDBIcon icon="plus" className="cartOp" onClick={() =>
                                        handleAddToCart(
                                            item.item.slug,
                                            item.item_variations
                                        )
                                    } />
                                    {item.quantity}
                                    {!item.item_variations.length > 0 ?
                                    <MDBIcon icon="minus" className="cartOp" onClick={() => handleRemoveQuantityFromCart(item.item.slug)} />
                                    :<MDBIcon icon="ban" className="cartOp text-muted" />
                                }
                                </td>
                                <td className="">
                                    {item.item.discount_price && (
                                        <MDBBadge color="default-color" className="p-1 mr-2">
                                            ON DISCOUNT
                                        </MDBBadge>
                                    )} <span className="font-weight-bold">${item.final_price}</span>
                                    <MDBIcon icon="trash" className="ml-md-5 ml-2 red-text cartOp" onClick={() => handleRemoveItem(item.id)} />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="4"></td>
                            <td>
                                <h4>Total <b>${data?.total}</b></h4>
                                {data?.coupon && (
                                    <MDBBadge className="ml-1">
                                        Current coupon: {data.coupon.code} for $
                                        {data.coupon.amount}
                                    </MDBBadge>
                                )}
                            </td>
                        </tr>
                    </MDBTableBody>
                    <MDBTableFoot>
                        <tr>
                            <td colSpan="4"></td>
                            <td><Link to="/checkout"><MDBBtn color="warning">Proceed to checkout</MDBBtn></Link></td>
                        </tr>
                    </MDBTableFoot>

                </MDBTable>
                :
                renderAlert()
            }

        </MDBContainer>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        cart: state.cart.shoppingCart,
        cartError: state.cart.error,
        authError: state.auth.error,
        authLoading: state.auth.error,
        cartLoading: state.auth.error,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        refreshCart: () => dispatch(fetchCart())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
