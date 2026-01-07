import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../axios";
import AddressForm from "../components/AddressForm";
import PaymentHistory from "../components/PaymentHistory";
import ProfileForm from "../components/ProfileForm";
import {
  API_ENDPOINTS
} from "../constants/api";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";

const Profile = ({ isAuthenticated, user }: any) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    activeItem: "profile",
    addresses: [] as any[],
    selectedAddress: null as any,
    loading: false,
    error: null as any,
  });

  const [allCountries, setCountries] = useState<any[]>([]);

  const userID = user.id;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
      return;
    }

    handleFetchCountries();
    handleFetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      state.activeItem === "billingAddress" ||
      state.activeItem === "shippingAddress"
    ) {
      handleFetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeItem]);

  const handleItemClick = (name: string) => {
    setState((s) => ({
      ...s,
      activeItem: name,
      selectedAddress: null,
    }));
  };

  const handleGetActiveItem = () => {
    switch (state.activeItem) {
      case "billingAddress":
        return "Billing Address";
      case "shippingAddress":
        return "Shipping Address";
      case "paymentHistory":
        return "Payment History";
      default:
        return "Profile";
    }
  };

  const handleFormatCountries = (countries: any) =>
    Object.keys(countries).map((k) => ({
      key: k,
      text: countries[k],
      value: k,
    }));

  const handleFetchCountries = () => {
    axiosClient
      .get(API_ENDPOINTS.Countries.List)
      .then((res) => {
        setCountries(handleFormatCountries(res.data.data));
      })
      .catch((err) =>
        setState((s) => ({ ...s, error: err }))
      );
  };

  const handleFetchAddresses = () => {
    setState((s) => ({ ...s, loading: true }));

    const type =
      state.activeItem === "billingAddress" ? "B" : "S";

    axiosClient
      .get(API_ENDPOINTS.Addresses.ListByAddressType(type))
      .then((res) => {
        setState((s) => ({
          ...s,
          addresses: res.data.data,
          loading: false,
          selectedAddress: null,
        }));
      })
      .catch((err) =>
        setState((s) => ({
          ...s,
          error: err,
          loading: false,
        }))
      );
  };

  const handleDeleteAddress = (addressID: string) => {
    axiosClient
      .delete(API_ENDPOINTS.Addresses.Delete(addressID))
      .then(() => handleFetchAddresses())
      .catch((err) =>
        setState((s) => ({ ...s, error: err }))
      );
  };

  const handleSelectAddress = (address: any) => {
    setState((s) => ({ ...s, selectedAddress: address }));
  };

  const handleFormChange = () => {
    setState((s) => ({ ...s, selectedAddress: null }));
  };

  const renderAddresses = () => (
    <>
      {state?.addresses?.map((a, i) => (
        <div
          key={i}
          className="mb-4 rounded border bg-white p-4 shadow"
        >
          <h4 className="font-semibold">
            {a.apartment_address}, {a.street_address}
          </h4>

          <p className="text-sm">Country: {a.country}</p>
          <p className="text-sm">Zip: {a.zip}</p>
          <p className="text-sm">
            Default:{" "}
            {a.default ? (
              <span className="text-green-600">✔</span>
            ) : (
              <span className="text-red-600">✖</span>
            )}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleSelectAddress(a)}
              className="rounded bg-yellow-500 px-4 py-1 text-white"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteAddress(a.id)}
              className="rounded bg-red-600 px-4 py-1 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {state.selectedAddress ? (
        <div className="animate-fadeIn">
          <AddressForm
            activeItem={state.activeItem}
            userID={userID}
            countries={allCountries}
            address={state.selectedAddress}
            formType={UPDATE_FORM}
            callback={handleFetchAddresses}
            formChanger={handleFormChange}
          />
        </div>
      ) : (
        <div className="animate-fadeIn">
          <AddressForm
            activeItem={state.activeItem}
            userID={userID}
            countries={allCountries}
            formType={CREATE_FORM}
            callback={handleFetchAddresses}
            formChanger={handleFormChange}
          />
        </div>
      )}
    </>
  );

  const renderComponent = () => {
    if (state.activeItem === "paymentHistory")
      return <PaymentHistory />;
    if (state.activeItem === "profile")
      return <ProfileForm />;
    return renderAddresses();
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-4">
          <nav className="space-y-2 border rounded p-4">
            {[
              { key: "profile", label: "Profile" },
              { key: "billingAddress", label: "Billing Address" },
              { key: "shippingAddress", label: "Shipping Address" },
              { key: "paymentHistory", label: "Payment History" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleItemClick(item.key)}
                className={`block w-full text-left px-3 py-2 rounded ${
                  state.activeItem === item.key
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-8">
          <h3 className="mb-4 text-2xl font-semibold">
            {handleGetActiveItem()}
          </h3>

          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.token !== null,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Profile);
