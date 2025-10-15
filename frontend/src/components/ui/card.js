import React from 'react';
import './card.css';

const Card = ({
  children,
  className = '',
  hover = true,
  padding = 'medium',
  ...props
}) => {
  const cardClasses = [
    'card',
    `card-padding-${padding}`,
    hover && 'card-hover',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`card-content ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
