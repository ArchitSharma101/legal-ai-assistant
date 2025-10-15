import React from 'react';
import './loading.css';

const Loading = ({
  size = 'medium',
  text = 'Loading...',
  overlay = false,
  className = ''
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-${size}`,
    className
  ].filter(Boolean).join(' ');

  const content = (
    <div className="loading-container">
      <div className={spinnerClasses}>
        <div className="loading-ring"></div>
        <div className="loading-ring"></div>
        <div className="loading-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {content}
      </div>
    );
  }

  return content;
};

const LoadingSkeleton = ({
  width = '100%',
  height = '20px',
  className = '',
  lines = 1
}) => {
  const skeletonClasses = ['loading-skeleton', className].filter(Boolean).join(' ');

  if (lines === 1) {
    return (
      <div
        className={skeletonClasses}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className="loading-skeleton-lines">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={skeletonClasses}
          style={{
            width: index === lines - 1 ? '60%' : width,
            height
          }}
        />
      ))}
    </div>
  );
};

export { Loading, LoadingSkeleton };
export default Loading;
