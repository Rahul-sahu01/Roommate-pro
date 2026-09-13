import React from 'react';

export function SkeletonGrid() {
  return (
    <div className="property-grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="property-card skeleton-card" key={index}>
          <div className="skel-image" />
          <div className="skel-line lg" />
          <div className="skel-line" />
          <div className="skel-line sm" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="skeleton-detail">
      <div className="skel-image big" />
      <div className="skel-line lg" />
      <div className="skel-line" />
    </div>
  );
}
