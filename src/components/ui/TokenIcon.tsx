import React from 'react';
import Image from 'next/image';

// A simple map of token symbols to their image paths
const tokenIconMap: { [key: string]: string } = {
  'STX': '/stx-icon.svg',
  'xBTC': '/xbtc-icon.svg',
  'sBTC': '/sbtc-icon.svg',
  'USDA': '/usda-icon.svg',
  // Add other tokens here
};

interface TokenIconProps {
  token: string;
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({ token, className }) => {
  const iconPath = tokenIconMap[token] || '/default-token-icon.svg'; // Fallback to a default icon
  return <Image src={iconPath} alt={`${token} icon`} className={className} width={24} height={24} />;
};

export default TokenIcon;
