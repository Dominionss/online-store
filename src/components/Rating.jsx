function Rating({ value = 0, count = 0 }) {
  const rounded = Math.round(Number(value) * 10) / 10;

  return (
    <div className="rating" aria-label={`${rounded} out of 5 stars`}>
      <span aria-hidden="true">{'★'.repeat(Math.round(value)).padEnd(5, '☆')}</span>
      <strong>{rounded || 'New'}</strong>
      {count ? <small>({count})</small> : null}
    </div>
  );
}

export default Rating;
