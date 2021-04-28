import React from 'react';

const FooterButton = ({ onClick, href = '#', className = '', children }) => (
  <a
    className={`p-2 h-full flex items-center ${className}`}
    onClick={onClick}
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </a>
);

export default FooterButton;
