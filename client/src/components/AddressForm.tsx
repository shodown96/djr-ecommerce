import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { authAxios } from "../axios";
import {
  addressCreateURL,
  addressUpdateURL,
} from "../constants";

const UPDATE_FORM = "UPDATE_FORM";

type CountryOption = {
  value: string;
  text: string;
};

type AddressFormData = {
  address_type: string;
  apartment_address: string;
  country: string;
  default: boolean;
  id: string;
  street_address: string;
  user: number;
  zip: string;
};

type Props = {
  countries?: CountryOption[];
  formType: string;
  formChanger: () => void;
  activeItem: "billingAddress" | "shippingAddress" | "profile" | string;
  userID: number;
  callback: () => void;
  address?: AddressFormData;
};

type State = {
  error: any;
  loading: boolean;
  saving: boolean;
  success: boolean;
  formData: AddressFormData;
};

const AddressForm: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    error: null,
    loading: false,
    saving: false,
    success: false,
    formData: {
      address_type: "",
      apartment_address: "",
      country: "",
      default: false,
      id: "",
      street_address: "",
      user: 1,
      zip: "",
    },
  });

  const { countries, formType, formChanger, activeItem, userID, callback } = props;
  const { error, formData, success, saving, loading } = state;

  useEffect(() => {
    if (formType === UPDATE_FORM && props.address) {
      setState((prev) => ({
        ...prev,
        formData: props.address!,
      }));
    }
  }, [props.address, formType]);

  const handleToggleDefault = () => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        default: !prev.formData.default,
      },
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, saving: true }));

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
        address_type: activeItem === "billingAddress" ? "B" : "S",
      })
      .then(() => {
        setState((prev) => ({
          ...prev,
          saving: false,
          success: true,
          formData: { ...prev.formData, default: false },
        }));
        setTimeout(callback, 3000);
      })
      .catch((err) => {
        setState((prev) => ({ ...prev, error: err, saving: false }));
      });
  };

  const handleUpdateAddress = () => {
    authAxios
      .put(addressUpdateURL(formData.id), {
        ...formData,
        user: userID,
        address_type: activeItem === "billingAddress" ? "B" : "S",
      })
      .then((res) => {
        setState((prev) => ({
          ...prev,
          saving: false,
          success: true,
          formData: res.data,
        }));
        setTimeout(callback, 3000);
      })
      .catch((err) => {
        setState((prev) => ({ ...prev, error: err, saving: false }));
      });
  };

  const renderErrors = (e: any) => (
    <>
      {e.apartment_address && <p>Apartment Address: {e.apartment_address}</p>}
      {e.street_address && <p>Street Address: {e.street_address}</p>}
      {e.zip && <p>Zip: {e.zip}</p>}
      {e.country && <p>Country: {e.country}</p>}
      {e.default && <p>Default: {e.default}</p>}
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="rounded-md bg-green-100 p-4 text-green-800">
          <h3 className="text-lg font-semibold">Success !!</h3>
          <p>Your address was saved.</p>
        </div>
      )}

      {(loading || saving) && (
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-100 p-4 text-red-800">
          <h3 className="text-lg font-semibold">
            There were some errors with your submission
          </h3>
          {error.response?.data ? renderErrors(error.response.data) : <p>{error.message}</p>}
        </div>
      )}

      <input
        type="text"
        name="apartment_address"
        placeholder="Apartment Address"
        required
        value={formData.apartment_address}
        onChange={handleChange}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="text"
        name="street_address"
        placeholder="Street Address"
        required
        value={formData.street_address}
        onChange={handleChange}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="text"
        name="zip"
        placeholder="Zip"
        required
        value={formData.zip}
        onChange={handleChange}
        className="w-full rounded border px-3 py-2"
      />

      <select
        name="country"
        required
        value={formData.country}
        onChange={handleSelectChange}
        className="w-full rounded border px-3 py-2"
      >
        <option value="">Select Country</option>
        {countries?.map((country, i) => (
          <option key={i} value={country.value}>
            {country.text}
          </option>
        ))}
      </select>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.default}
          onChange={handleToggleDefault}
          className="h-4 w-4"
        />
        <span>
          Set as default{" "}
          {activeItem === "billingAddress" ? "billing" : "shipping"} address?
        </span>
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {formType === UPDATE_FORM ? "Edit" : "Add"}
        </button>

        {formType === UPDATE_FORM && (
          <button
            type="button"
            onClick={formChanger}
            className="rounded bg-gray-200 px-4 py-2"
          >
            New Address
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
