import React from 'react'
import { MDBContainer } from "mdbreact"
function ErrorPage() {
    return (
        <MDBContainer className="text-center z-depth-1 p-5 mt-n5">
            <h1 className="mt-5 teal-text" style={{ "font-size": "100px" }}>404</h1>
            <p style={{ "font-size": "30px" }}>Not Found</p>
            <p style={{ "font-size": "40px" }}>You seem to be lost <span role="img" aria-label="smile">😅</span></p>
        </MDBContainer>
    )
}

export default ErrorPage
