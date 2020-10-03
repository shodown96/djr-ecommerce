import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
    countryListURL,
    addressListURL,
    addressDeleteURL
} from "../constants";
import { authAxios } from "../utils";
import { MDBAnimation, MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCardText, MDBCol, MDBContainer, MDBFooter, MDBIcon, MDBNav, MDBNavItem, MDBNavLink, MDBRow } from "mdbreact"
import { Redirect } from 'react-router-dom';
import PaymentHistory from '../components/PaymentHistory';
import AddressForm from '../components/AddressForm';
import ProfileForm from '../components/ProfileForm';

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";


const Profile = (props) => {
    const { user } = props

    const [state, setState] = useState({
        activeItem: "profile",
        addresses: [],
        selectedAddress: null
        // countries: [],
        // userID: null,
    })
    const [allCountries, setCountries] = useState()

    useEffect(() => {
        handleFetchAddresses()
        handleFetchCountries()
        //eslint-disable-next-line
    }, [])

    const userID = user.id


    useEffect(() => {
        handleFetchAddresses()
        // eslint-disable-next-line
    }, [state.activeItem])


    const handleItemClick = name => {
        setState({ ...state, activeItem: name, selectedAddress: null });
    };

    const handleGetActiveItem = () => {
        const { activeItem } = state;
        if (activeItem === "billingAddress") {
            return "Billing Address";
        } else if (activeItem === "shippingAddress") {
            return "Shipping Address";
        } else if (activeItem === "paymentHistory") {
            return "Payment History";
        }
        return "Profile";
    };

    const handleFormatCountries = countries => {
        const keys = Object.keys(countries);
        return keys.map(k => {
            return {
                key: k,
                text: countries[k],
                value: k
            };
        });
    };

    const handleDeleteAddress = addressID => {
        authAxios
            .delete(addressDeleteURL(addressID))
            .then(res => {
                handleCallback();
            })
            .catch(err => {
                setState({ error: err });
            });
    };

    const handleSelectAddress = address => {
        setState({ ...state, selectedAddress: address });
    };

    const handleFetchCountries = () => {
        authAxios
            .get(countryListURL)
            .then(res => {
                setState({ ...state, countries: res.data });
                setCountries(handleFormatCountries(res.data))
            })
            .catch(err => {
                setState({ error: err });
            });
    };

    const handleFetchAddresses = () => {
        setState({ ...state, loading: true });
        const { activeItem } = state;
        authAxios
            .get(addressListURL(activeItem === "billingAddress" ? "B" : "S"))
            .then(res => {
                setState({ ...state, addresses: res.data, loading: false, selectedAddress: null });
            })
            .catch(err => {
                setState({ ...state, error: err });
            });
    };

    const handleCallback = () => {
        handleFetchAddresses();
    };

    const handleFormChange = () => {
        setState({ ...state, selectedAddress: null })
    }

    const {
        activeItem,
        addresses,
        // countries,
        selectedAddress,
        // userID
    } = state;

    const renderAddresses = () => {
        return (
            <>
                {addresses?.map((a, i) =>
                    <MDBCard className="mb-4" key={i}>
                        <MDBCardHeader>{a.apartment_address}, {a.street_address}</MDBCardHeader>
                        <MDBCardBody>
                            <MDBCardText>Country: {a.country}</MDBCardText>
                            <MDBCardText>Zip: {a.zip}</MDBCardText>
                            <MDBCardText>Default: {a.default ? <MDBIcon icon="check" className="green-text" /> : <MDBIcon icon="times-circle" far className="red-text" />}</MDBCardText>
                        </MDBCardBody>
                        <MDBFooter>
                            <MDBBtn color="warning" onClick={() => handleSelectAddress(a)}>Edit</MDBBtn>
                            <MDBBtn color="danger" onClick={() => handleDeleteAddress(a.id)}>Delete</MDBBtn>
                        </MDBFooter>
                    </MDBCard>
                )}
                {selectedAddress && (
                    <MDBAnimation type="fadeIn">
                        <AddressForm
                            activeItem={activeItem}
                            userID={userID}
                            countries={allCountries}
                            address={selectedAddress}
                            formType={UPDATE_FORM}
                            callback={handleCallback}
                            formChanger={handleFormChange}
                        />
                    </MDBAnimation>

                )}
                {selectedAddress === null &&
                    <MDBAnimation type="fadeIn">
                        <AddressForm
                            activeItem={activeItem}
                            countries={allCountries}
                            address={null}
                            formType={CREATE_FORM}
                            userID={userID}
                            callback={handleCallback}
                            formChanger={handleFormChange}
                        />
                    </MDBAnimation>
                }
            </>
        )
    }

    const renderComponent = () => {
        if (activeItem === "paymentHistory") { return <PaymentHistory /> }
        else if (activeItem === "profile") { return <ProfileForm /> }
        else { return renderAddresses() }
    }

    if (!props.isAuthenticated) {
        return <Redirect to="/login" />;
    }

    return (
        <MDBContainer>
            <MDBRow>
                <MDBCol lg="4" className="mb-4">
                    <MDBNav className="flex-column profile__nav">
                        <MDBNavItem className="border" active={activeItem === "profile"}>
                            <MDBNavLink className="text-black-50" to="#" onClick={() => handleItemClick("profile")}>Profile</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="border" active={activeItem === "billingAddress"}>
                            <MDBNavLink className="text-black-50" onClick={() => handleItemClick("billingAddress")} to="#">Billing Address</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="border" active={activeItem === "shippingAddress"}>
                            <MDBNavLink className="text-black-50" onClick={() => handleItemClick("shippingAddress")} to="#">Shipping Address</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="border" active={activeItem === "paymentHistory"}>
                            <MDBNavLink className="text-black-50" to="#" onClick={() => handleItemClick("paymentHistory")}>Payment History</MDBNavLink>
                        </MDBNavItem>
                    </MDBNav>
                </MDBCol>
                <MDBCol lg="8">
                    {/* {addresses?.map((a, i) =>
                        <p key={i}>{JSON.stringify(a)}</p>
                    )} */}

                    <h3>{handleGetActiveItem()}</h3>

                    {renderComponent()}

                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        user: state.auth.user,
    };
};

export default connect(mapStateToProps)(Profile)
// export default Profile