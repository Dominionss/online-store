function Button({ children, className = '', variant = 'primary', icon: Icon, ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {Icon ? <Icon size={18} aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
