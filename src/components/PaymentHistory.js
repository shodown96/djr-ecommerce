import React, { useEffect, useState } from 'react'
import { paymentListURL } from "../constants";
import { authAxios } from "../utils";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody
} from "mdbreact"

const PaymentHistory = () => {
    const [state, setState] = useState({
        payments: []
    })
    useEffect(() => {
        handleFetchPayments();
        // eslint-disable-next-line
    }, [])

    const handleFetchPayments = () => {
        setState({ loading: true });
        authAxios
            .get(paymentListURL)
            .then(res => {
                setState({
                    loading: false,
                    payments: res.data
                });
            })
            .catch(err => {
                setState({ error: err, loading: false });
            });
    };

    const { payments } = state
    return (
        <MDBTable responsive>
            <MDBTableHead>
                <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    <th>Date</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {payments?.map((p, i) => {
                    return (
                        <tr key={i}>
                            <td>{p.id}</td>
                            <td>{p.reference.indexOf("paystack") > 0 ? "N" : "$"} {p.amount}</td>
                            <td>{p.reference}</td>
                            <td>{new Date(p.timestamp).toUTCString()}</td>
                        </tr>
                    );
                })}

                {!payments &&
                    <tr>
                        <td colSpan="4"><h5 className="text-center text-muted mx-auto">You have not made any purchases yet.</h5></td>
                    </tr>

                }

            </MDBTableBody>
        </MDBTable>
    )
}

export default PaymentHistory
