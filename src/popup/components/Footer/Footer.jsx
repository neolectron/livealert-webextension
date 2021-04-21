import React from 'react';

const FooterButton = ({
  onClick,
  href = '#',
  backgroundColor = 'unset',
  children,
}) => (
  <a
    onClick={onClick}
    href={href}
    target="_blank"
    rel="noreferrer"
    style={{ backgroundColor: backgroundColor }}
  >
    {children}
  </a>
);

export default FooterButton;
