import { Minus, Plus, Trash2 } from 'lucide-react';
import Button from './Button.jsx';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function CartItem({ item, onUpdate, onRemove }) {
  const product = item.productId;
  const price = product?.discountPrice || product?.price || 0;

  return (
    <article className="cart-item">
      <img src={product?.images?.[0]} alt={product?.title || 'Cart product'} />
      <div>
        <h3>{product?.title}</h3>
        <p>{product?.brand}</p>
        <strong>{formatPrice(price)}</strong>
      </div>
      <div className="quantity-control">
        <button type="button" aria-label="Decrease quantity" onClick={() => onUpdate(item._id, item.quantity - 1)}>
          <Minus size={16} />
        </button>
        <span>{item.quantity}</span>
        <button type="button" aria-label="Increase quantity" onClick={() => onUpdate(item._id, item.quantity + 1)}>
          <Plus size={16} />
        </button>
      </div>
      <strong>{formatPrice(price * item.quantity)}</strong>
      <Button type="button" variant="ghost" icon={Trash2} onClick={() => onRemove(item._id)}>
        Remove
      </Button>
    </article>
  );
}

export default CartItem;
