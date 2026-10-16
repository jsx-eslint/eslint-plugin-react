import React, { useReducer, useState } from 'react';

type Item = {
  id: string;
  name: string;
  price: number;
  tags?: readonly string[];
};

interface CartProps {
  items: Item[];
  currency?: 'USD' | 'JPY';
  onCheckout: (items: Item[]) => void;
  discount?: number;
}

type Action =
  | { type: 'add'; item: Item }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

function reducer(state: Item[], action: Action): Item[] {
  switch (action.type) {
    case 'add':
      return [...state, action.item];
    case 'remove':
      return state.filter((item) => item.id !== action.id);
    default:
      return [];
  }
}

export function Cart({ items, currency = 'USD', onCheckout, discount }: CartProps) {
  const [cart, dispatch] = useReducer(reducer, items);
  const [note, setNote] = useState<string>('');
  const total = cart.reduce((sum, item) => sum + item.price, 0) * (1 - (discount ?? 0));

  return (
    <div className="cart">
      {cart.map((item) => (
        <CartRow key={item.id} item={item} onRemove={() => dispatch({ type: 'remove', id: item.id })} />
      ))}
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <p>
        Total: {total.toFixed(2)} {currency}
      </p>
      <button type="button" onClick={() => onCheckout(cart)} disabled={cart.length === 0}>
        Checkout
      </button>
      <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
    </div>
  );
}

interface CartRowProps {
  item: Item;
  onRemove(): void;
  highlighted?: boolean;
}

function CartRow(props: CartRowProps) {
  const { item, onRemove } = props;
  return (
    <div className={props.highlighted ? 'row highlighted' : 'row'}>
      <span>{item.name}</span>
      {item.tags && item.tags.length && <small>{item.tags.join(', ')}</small>}
      <button onClick={onRemove}>Remove</button>
    </div>
  );
}

export class LegacyCart extends React.Component<CartProps, { open: boolean }> {
  state = { open: false };

  render() {
    const { items } = this.props;
    return (
      <details open={this.state.open} onToggle={() => this.setState({ open: !this.state.open })}>
        <summary>{items.length} items</summary>
        <Cart {...this.props} />
      </details>
    );
  }
}

export default Cart;
