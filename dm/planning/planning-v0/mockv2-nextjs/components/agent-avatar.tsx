import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

type AgentAvatarProps = {
  seed: string; // Agent codename or identifier
  size?: number; // Size in pixels
  className?: string;
  style?: React.CSSProperties;
  variant?: 'standard' | 'classified' | 'undercover';
};

const AgentAvatar = ({ 
  seed, 
  size = 48, 
  className = '', 
  style = {},
  variant = 'standard'
}: AgentAvatarProps) => {
  const avatarSvg = useMemo(() => {
    // Base options
    const options = {
      seed,
      size,
      radius: 50,
    };
    
    // Add variant-specific styling
    if (variant === 'standard') {
      Object.assign(options, {
        backgroundColor: ['ff0000', '990000'],
      });
    } else if (variant === 'classified') {
      Object.assign(options, {
        backgroundColor: ['222222'],
      });
    } else if (variant === 'undercover') {
      Object.assign(options, {
        backgroundColor: ['000000'],
      });
    }
    
    return createAvatar(lorelei, options).toString();
  }, [seed, size, variant]);

  return (
    <div 
      className={`inline-block overflow-hidden ${
        variant === 'classified' ? 'grayscale' : ''
      } ${
        variant === 'undercover' ? 'opacity-80' : ''
      } ${className}`}
      style={{ 
        width: size, 
        height: size, 
        ...style 
      }}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
};

export default AgentAvatar; 