import { useState } from 'react';

// Shows the product image, or a tinted placeholder with the first letter
export default function ProductImage({ product, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (product.image && !failed) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`object-contain ${className}`}
      />
    );
  }
  const hue = [...product.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      role="img"
      aria-label={product.name}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 28% 92%), hsl(${hue} 32% 82%))` }}
      className={`flex items-center justify-center ${className}`}
    >
      <span className="font-serif text-5xl text-ink-900/30">{product.name[0]}</span>
    </div>
  );
}
