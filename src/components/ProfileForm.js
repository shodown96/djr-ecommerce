import { MDBBtn, MDBInput } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { authDeleteAccount, authUpdateDetails } from "../store/actions/auth"
import { MDBAlert } from "mdbreact"

function ProfileForm(props) {
    const { user, updateProfile, loading, error, deleteAccount } = props
    const [data, setData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: ""
    })
    const [success, setSuccess] = useState(false)
    // const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    // let randomCode = "";
    // for (let i in letters) {
    //     i[Math.floor(Math.random() * letters.length)]
    //     randomCode += i
    //     return randomCode
    // }
    // console.log(randomCode)
    // const [formCode, setformCode] = useState()
    // console.log("data", data)

    useEffect(() => {
        setData({ ...user })
    }, [user])
    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        updateProfile(data)
        setSuccess(true)
    }

    const handleErrors = (e) => <>
        {e.email && <p className="mb-0">Email: {e.email}</p>}
        {e.username && <p className="mb-0">Username: {e.username}</p>}
        {e.first_name && <p className="mb-0">First Name: {e.first_name}</p>}
        {e.last_name && <p className="mb-0">Last Name: {e.last_name}</p>}
    </>

    return (
        <div>
            {error && (
                <MDBAlert color="danger">
                    <h4>There were some errors with your submission</h4>
                    {error.response && error.response.data ? <p>{handleErrors(error.response.data)}</p> :
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
            {!error && success && (
                <MDBAlert color="success">
                    <h4>Profile Update !!</h4>
                    <p>Your profile has been successfully updated !!</p>
                </MDBAlert>
            )}
            <form onSubmit={handleSubmit}>
                <MDBInput label="First Name" name="first_name" value={data.first_name} onChange={handleChange} required />
                <MDBInput label="Last Name" name="last_name" value={data.last_name} onChange={handleChange} required />
                <MDBInput label="Email" name="email" value={data.email} onChange={handleChange} required />
                <MDBInput label="Username" name="username" value={data.username} onChange={handleChange} required />
                <MDBBtn type="submit">Update</MDBBtn>
            </form>
            <MDBAlert color="danger" className="mt-4">
                <h4>Delete Your Account</h4>
                <p>Once you do this, there is no going back... type in {}</p>
                <MDBBtn color="danger" onClick={deleteAccount}>Delete my account</MDBBtn>
            </MDBAlert>
        </div>
    )
}
const mapStateToProps = (state) => ({
    token: state.auth.token,
    user: state.auth.user,
    loading: state.auth.loading,
    error: state.auth.error,
})

const mapDispatchToProps = dispatch => ({
    updateProfile: (data) => dispatch(authUpdateDetails(data)),
    deleteAccount: (token) => dispatch(authDeleteAccount(token))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm)
