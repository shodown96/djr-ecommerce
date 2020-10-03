import React from 'react'
import {
    MDBContainer,
    MDBListGroup,
    MDBListGroupItem,
    MDBBadge
}
    from "mdbreact"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import host from '../constants'

// const OrderPreview = ({ data }) => {
const OrderPreview = (props) => {
    const data = props.cart
    return (
        <MDBContainer className="mb-4">
            <MDBListGroup style={{ width: "100%" }}>
                {data?.order_items?.map((item, i) =>
                    <MDBListGroupItem hover href="#" key={i}>
                        <div className="d-flex w-100 justify-content-between">
                            <Link to={"products/" + item.item.id}>
                                <img src={`${host}${item.item.image}`} alt="" className="img-fluid" style={{ height: "200px" }} />
                            </Link>
                            <span>
                                <small className="text-muted mr-2">
                                    {item.quantity} x {item.item.title}
                                </small>
                                <MDBBadge>
                                    ${item.final_price}
                                </MDBBadge>
                            </span>
                        </div>
                    </MDBListGroupItem>
                )}
                <MDBListGroupItem hover className="d-flex justify-content-end">
                    <strong>
                        Order Total: ${data?.total}
                        {data?.coupon && (
                            <MDBBadge className="ml-1">
                                Current coupon: {data.coupon.code} for $
                                {data.coupon.amount}
                            </MDBBadge>
                        )}
                    </strong>
                </MDBListGroupItem>
            </MDBListGroup>
        </MDBContainer>
    )
}
const mapStateToProps = (state) => ({
    cart: state.cart.shoppingCart,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPreview)
