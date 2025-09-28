import React from 'react';
import styled from 'styled-components';

const BrandImage = styled.img`
  height: ${props => props.size || '40px'};
  width: auto;
  object-fit: contain;
`;

const Logo = ({ size, className, style }) => {
  return (
    <BrandImage 
      src="/light.png" 
      alt="EventSphere Logo" 
      size={size}
      className={className}
      style={style}
    />
  );
};

export default Logo;