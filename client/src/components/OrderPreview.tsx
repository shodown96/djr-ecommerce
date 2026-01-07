import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "../constants/api";

type OrderItem = {
  quantity: number;
  final_price: number;
  item: {
    id: string;
    title: string;
    image: string;
  };
};

type Coupon = {
  code: string;
  amount: number;
};

type Cart = {
  order_items?: OrderItem[];
  total?: number;
  coupon?: Coupon;
};

type Props = {
  cart: Cart;
};

const OrderPreview: React.FC<Props> = ({ cart }) => {
  return (
    <div className="mb-4 w-full">
      <ul className="w-full divide-y rounded border">
        {cart?.order_items?.map((item, i) => (
          <li
            key={i}
            className="hover:bg-gray-50 transition-colors"
          >
            <div className="flex w-full items-center justify-between p-4 gap-4">
              <Link to={`products/${item.item.id}`}>
                <img
                  src={`${BASE_API_URL}${item.item.image}`}
                  alt={item.item.title}
                  className="h-50 w-auto object-contain"
                />
              </Link>

              <div className="flex items-center gap-2">
                <small className="text-gray-500">
                  {item.quantity} x {item.item.title}
                </small>

                <span className="rounded bg-gray-200 px-2 py-1 text-sm">
                  ${item.final_price}
                </span>
              </div>
            </div>
          </li>
        ))}

        <li className="flex justify-end p-4">
          <strong className="flex items-center gap-2">
            Order Total: ${cart?.total}

            {cart?.coupon && (
              <span className="rounded bg-gray-200 px-2 py-1 text-sm">
                Current coupon: {cart.coupon.code} for ${cart.coupon.amount}
              </span>
            )}
          </strong>
        </li>
      </ul>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  cart: state.cart.shoppingCart,
});

export default connect(mapStateToProps)(OrderPreview);
