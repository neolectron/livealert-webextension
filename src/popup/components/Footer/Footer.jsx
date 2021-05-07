import React from 'react';

const Footer = ({ className = '', children }) => (
  <div className={`h-9 px-2 flex items-center ${className}`}>{children}</div>
);

export default Footer;
