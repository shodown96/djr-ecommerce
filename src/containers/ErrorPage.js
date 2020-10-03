import React from 'react'
import error404 from "../components/404.webp";
function ErrorPage() {
    return (
        <div className="mt-n5 text-center">
            <img src={error404} alt="" className="img-fluid" />
        </div>
    )
}

export default ErrorPage
