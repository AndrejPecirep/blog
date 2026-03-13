import React from 'react';

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="loader-wrapper">
      <div className="loader" />
      <p>{label}</p>
    </div>
  );
}
