import { X } from 'lucide-react';
import Button from './Button.jsx';

function Modal({ title, children, open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>{title}</h2>
          <Button type="button" variant="ghost" icon={X} onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default Modal;
