import React from 'react';
import './input.css';

const Input = ({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'input-field',
    error && 'input-error',
    startIcon && 'input-with-start-icon',
    endIcon && 'input-with-end-icon',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="required">*</span>}
        </label>
      )}

      <div className="input-container">
        {startIcon && <span className="input-icon input-start-icon">{startIcon}</span>}

        <input
          className={inputClasses}
          {...props}
        />

        {endIcon && <span className="input-icon input-end-icon">{endIcon}</span>}
      </div>

      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

export default Input;
