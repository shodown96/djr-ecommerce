import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBCol, MDBContainer, MDBRow, MDBFooter, MDBIcon
} from "mdbreact";
import { logout, authCheckState } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import { Link, useHistory } from 'react-router-dom';

export const Layout = (props) => {
  const [opened, setOpened] = useState(false)

  const toggleCollapse = () => {
    setOpened(!opened);
  }
  const { authenticated, cart, loading } = props;

  const history = useHistory()
  useEffect(() => {
    if(authenticated) {
      props.fetchCart();
      props.onTryAutoSignup()
    }
  }, [authenticated])

  return (
    <div>
      <MDBNavbar color="elegant-color" dark expand="md">
        <MDBNavbarBrand>
          <Link className="white-text font-weight-bolder" to="/">DJR-ECOMMERCE</Link>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={opened} navbar>
          <MDBNavbarNav left>
            <MDBNavItem>
              <MDBNavLink to="/">Home</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/products">Products</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
            </MDBNavItem>
            <MDBNavItem>
              <MDBFormInline waves>
                {/* <div className="md-form my-0">
                  <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                </div> */}
              </MDBFormInline>
            </MDBNavItem>
          </MDBNavbarNav>
          {authenticated ?
            <MDBNavbarNav right>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <span className="mr-2"><MDBIcon icon="shopping-cart" /> ({cart && !loading ? cart.order_items.length : 0})</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu right>
                  {cart && cart.order_items.length > 0 && !loading ?
                    <>
                      {cart.order_items.map((item, i) =>
                        <MDBDropdownItem key={i}>
                          <Link to={"/products/" + item.item.id}>{item.quantity} x {item.item.title}</Link>
                        </MDBDropdownItem>
                      )}
                      {/* {cart.order_items.length < 1 ? (
                        <MDBDropdownItem>No items in your cart</MDBDropdownItem>
                      ) : null} */}
                      <hr className="my-1" />
                      {/* <MDBDropdownItem divider></MDBDropdownItem> */}
                      <MDBDropdownItem onClick={() => history.push("/order-summary")}>
                        <MDBIcon icon="angle-right" /> View All
                      </MDBDropdownItem>

                    </>
                    : <MDBDropdownItem>No items in your cart</MDBDropdownItem>
                  }
                </MDBDropdownMenu>
              </MDBDropdown>
              {cart && cart.order_items.length > 0 &&
                <MDBNavItem>
                  <MDBNavLink to="/checkout">Checkout</MDBNavLink>
                </MDBNavItem>
              }
              <MDBNavItem>
                <MDBNavLink to="/profile">Profile</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem onClick={() => props.logout()}>
                <MDBNavLink to="#">Logout</MDBNavLink>
              </MDBNavItem>
            </MDBNavbarNav>
            :
            <MDBNavbarNav right>
              <MDBNavItem>
                <MDBNavLink to="/login">Login</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="/signup">Signup</MDBNavLink>
              </MDBNavItem>
            </MDBNavbarNav>
          }

        </MDBCollapse>
      </MDBNavbar>

      <div className="mt-5 trueBody">
        {props.children}
      </div>

      <MDBFooter color="elegant-color" className="font-small pt-4 mt-4">
        <MDBContainer fluid className="text-center text-md-left">
          <MDBRow>
            <MDBCol md="6">
              <h5 className="title font-weight-bolder" onClick>DJR-ECOMMERCE</h5>
              <p>
                Here you can use rows and columns here to organize your footer
                content.
            </p>
              <h6 className="mb-4">Get connected with us on social networks!</h6>
              <p>
                <a target="_blank" rel="noopener noreferrer" href="https://web.facebook.com/elijah.soladoye/">
                  <i className="fab fa-facebook-f white-text fa-lg mr-4"> </i>
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/shodown96/">
                  <i className="fab fa-github white-text fa-lg mr-4"> </i>
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/elijah-soladoye-2b99b11b5">
                  <i className="fab fa-linkedin-in white-text fa-lg mr-4"> </i>
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/shodown96/">
                  <i className="fab fa-instagram white-text fa-lg"> </i>
                </a>
              </p>
            </MDBCol>
            <MDBCol md="2">
              <h5 className="title">Links</h5>
              <ul className="pl-0">
                <li className="list-unstyled">
                  <Link to="/">Home</Link>
                </li>
                <li className="list-unstyled">
                  <Link to="/products">Products</Link>
                </li>
                {authenticated ?
                  <>
                    <li className="list-unstyled">
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li className="list-unstyled">
                      <Link to="#" onClick={() => props.logout()}>Logout</Link>
                    </li>
                  </>
                  :
                  <>
                    <li className="list-unstyled">
                      <Link to="/login">Login</Link>
                    </li>
                    <li className="list-unstyled">
                      <Link to="/signup">Signup</Link>
                    </li>
                  </>
                }
              </ul>
            </MDBCol>
            <MDBCol md="3">
              <h5>Contacts</h5>

              <ul className="fa-ul ml-0 foot-desc">
                <li className="mb-2"><span className=" mr-2"><i className="far fa-map"></i></span>New York, Avenue Street 10
                </li>
                <li className="mb-2"><span className=" mr-2"><i className="fas fa-phone-alt"></i></span>042 876 836 908</li>
                <li className="mb-2" > <span className=" mr-2" > <i className="far fa-envelope" ></i></span> company@example.com</li>
                <li><span className=" mr-2"><i className="far fa-clock"></i></span> Monday - Friday: 10 - 17</li>
              </ul>

            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className="footer-copyright text-center py-3">
          <MDBContainer fluid>
            &copy; {new Date().getFullYear()} Copyright: <a href="https://elijahsoladoye.netlify.app"> Elijah Soladoye </a>
          </MDBContainer>
        </div>
      </MDBFooter>

    </div>
  )
}

// export default Layout
const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart()),
    onTryAutoSignup: () => dispatch(authCheckState())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
