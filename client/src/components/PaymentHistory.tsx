import React, { useEffect, useState } from "react";
import { axiosClient } from "../axios";
import { API_ENDPOINTS } from "../constants/api";

type Payment = {
  id: string;
  api_id: string;
  amount: number;
  reference: string;
  paid_at: string;
  provider: string;
};

type State = {
  payments: Payment[];
  loading: boolean;
  error: any;
};

const PaymentHistory: React.FC = () => {
  const [state, setState] = useState<State>({
    payments: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    handleFetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchPayments = () => {
    setState((prev) => ({ ...prev, loading: true }));

    axiosClient
      .get(API_ENDPOINTS.Payments.List)
      .then((res) => {
        setState({
          payments: res.data.data,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          error: err,
          loading: false,
        }));
      });
  };

  const { payments, loading, error } = state;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Amount</th>
            <th className="border px-4 py-2 text-left">Reference</th>
            <th className="border px-4 py-2 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">
                {p.provider.includes("paystack") ? "₦" : "$"} {p.amount}
              </td>
              <td className="border px-4 py-2">{p.reference}</td>
              <td className="border px-4 py-2">
                {new Date(p.paid_at).toUTCString()}
              </td>
            </tr>
          ))}

          {!loading && payments.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                You have not made any purchases yet.
              </td>
            </tr>
          )}

          {loading && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
              </td>
            </tr>
          )}

          {error && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-red-600">
                Failed to load payment history.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
