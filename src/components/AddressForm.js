import React, { useEffect, useState } from 'react'
import {
    MDBInput,
    MDBAlert,
    MDBBtn
} from "mdbreact"
import {
    addressCreateURL,
    addressUpdateURL,
} from "../constants";
import { authAxios } from "../utils";

const UPDATE_FORM = "UPDATE_FORM";
// const CREATE_FORM = "CREATE_FORM";


const AddressForm = (props) => {
    const [state, setState] = useState({
        error: null,
        loading: false,
        formData: {
            address_type: "",
            apartment_address: "",
            country: "",
            default: false,
            id: "",
            street_address: "",
            user: 1,
            zip: ""
        },
        saving: false,
        success: false
    })



    const { countries, formType, formChanger, activeItem, userID, callback } = props;
    const { error, formData, success, saving, loading } = state;

    const checkForm = () => {
        const { address, formType } = props;
        if (formType === UPDATE_FORM) {
            setState({ ...state, formData: address });
        }
    }

    useEffect(() => {
        checkForm()
        // eslint-disable-next-line
    }, [props.address])

    const handleToggleDefault = () => {
        const updatedFormdata = {
            ...formData,
            default: !formData.default
        };
        setState({
            formData: updatedFormdata
        });
    };

    const handleChange = e => {
        const updatedFormdata = {
            ...formData,
            [e.target.name]: e.target.value
        };
        setState({
            ...state,
            formData: updatedFormdata
        });
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target
        const { formData } = state;
        const updatedFormdata = {
            ...formData,
            [name]: value
        };
        setState({
            ...state, formData: updatedFormdata
        });
    };

    const handleSubmit = e => {
        e.preventDefault()
        setState({ saving: true });
        if (formType === UPDATE_FORM) {
            handleUpdateAddress();
        } else {
            handleCreateAddress();
        }
    };

    const handleCreateAddress = () => {
        authAxios
            .post(addressCreateURL, {
                ...formData,
                user: userID,
                address_type: activeItem === "billingAddress" ? "B" : "S"
            })
            .then(res => {
                setState({
                    saving: false,
                    success: true,
                    formData: { ...state.formData, default: false }
                });
                setTimeout(() => {
                    callback();
                }, 3000);
            })
            .catch(err => {
                setState({ error: err });
            });
    };

    const handleUpdateAddress = () => {
        authAxios
            .put(addressUpdateURL(formData.id), {
                ...formData,
                user: userID,
                address_type: activeItem === "billingAddress" ? "B" : "S"
            })
            .then(res => {
                setState({
                    saving: false,
                    success: true,
                    // formData: { ...state.formData, default: false }
                    formData: res.data
                });
                setTimeout(() => {
                    callback();
                }, 3000);
            })
            .catch(err => {
                setState({ error: err });
            });
    };


    const handleErrors = (e) => <>
        {e.apartment_address && <p className="mb-0">Apartment Address: {e.apartment_address}</p>}
        {e.street_address && <p className="mb-0">Street Address: {e.street_address}</p>}
        {e.zip && <p className="mb-0">Zip: {e.zip}</p>}
        {e.country && <p className="mb-0">Country: {e.country}</p>}
        {e.default && <p className="mb-0">Default: {e.default}</p>}
    </>

    return (
        <form onSubmit={handleSubmit}>
            {/* <MDBBtn onClick={callback}>Test Callback</MDBBtn> */}
            {success && (
                <MDBAlert color="success">
                    <h3>Success !!</h3>
                    <p>Your address was saved.</p>
                </MDBAlert>
            )}
            {(loading || saving) && (
                <div className="mx-auto text-center green-text">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {error && (

                <MDBAlert color="danger">
                    <h3>There were some errors with your submission</h3>
                    {error.response && error.response.data ? <p>{handleErrors(error.response.data)}</p> :
                        <p>{error.message}</p>}
                </MDBAlert>
            )}
            <MDBInput label="Apartment Address" name="apartment_address" onChange={handleChange} required value={formData?.apartment_address} />
            <MDBInput label="Street Address" name="street_address" onChange={handleChange} required value={formData?.street_address} />
            <MDBInput label="Zip" name="zip" onChange={handleChange} required value={formData?.zip} />
            <select name="country" className="browser-default custom-select my-2" onChange={handleSelectChange} value={formData?.country} required>
                <option>Select Country</option>
                {countries?.map((country, i) =>
                    <option value={country.value} key={i}>{country.text}</option>
                )}
            </select>
            <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="default" onChange={handleToggleDefault} checked={formData?.default} />
                <label className="custom-control-label" htmlFor="default">
                    Set as default {activeItem === "billingAddress" ? "billing" : "shipping"} address ?
                </label>
            </div>
            <MDBBtn type="submit" disabled={saving}>{formType === UPDATE_FORM ? "Edit" : "Add"}</MDBBtn>
            {formType === UPDATE_FORM && <MDBBtn onClick={formChanger}>New Address</MDBBtn>}
        </form>
    )
}

export default AddressForm
