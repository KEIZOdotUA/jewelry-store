import './CartItem.css';
import PropTypes from 'prop-types';
import useCartContext from '@contexts/Cart/useCartContext';
import QuantityInput from '@components/shared/QuantityInput/QuantityInput';
import ProductImage from '@components/Product/Image/ProductImage';

function CartItem({ item }) {
  const { removeItem, incrementItemQuantity, decrementItemQuantity } = useCartContext();

  return (
    <div className="cart-item">
      <div className="cart-item__img-container">
        <ProductImage id={item.id} name={item.name} size="s" className="cart-img" />
      </div>
      <div className="cart-item__description-container">
        <div className="cart-item__title">
          {item.name}
          {item.selectedSize > 0 && `, ${item.selectedSize} розмір`}
        </div>
        <div className="cart-item__price">{`${item.price} грн`}</div>
        <div
          className="cart-item__delete"
          role="button"
          tabIndex={0}
          onClick={() => removeItem(item.id)}
          onKeyDown={() => removeItem(item.id)}
        >
          видалити
        </div>
        <div className="cart-item__quantity">
          <QuantityInput
            quantity={item.quantity}
            onIncrement={() => incrementItemQuantity(item.id)}
            onDecrement={() => decrementItemQuantity(item.id)}
          />
        </div>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    category: PropTypes.number.isRequired,
    selectedSize: PropTypes.number,
  }).isRequired,
};

export default CartItem;
