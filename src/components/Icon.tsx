interface IconProps {
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Dynamic app icon component that serves the most appropriate icon size
 * based on the requested dimensions and device capabilities
 */
export function Icon({ size = 48, className = "", alt = "Escape" }: IconProps) {
  // Determine the best icon to use based on size
  const getIconPath = (requestedSize: number): string => {
    // For very small icons, use iOS icons (they have the most size options)
    if (requestedSize <= 20) return `/icons/ios/20.png`;
    if (requestedSize <= 29) return `/icons/ios/29.png`;
    if (requestedSize <= 32) return `/icons/ios/32.png`;
    if (requestedSize <= 40) return `/icons/ios/40.png`;
    if (requestedSize <= 48) return `/icons/android/android-launchericon-48-48.png`;
    if (requestedSize <= 57) return `/icons/ios/57.png`;
    if (requestedSize <= 60) return `/icons/ios/60.png`;
    if (requestedSize <= 72) return `/icons/android/android-launchericon-72-72.png`;
    if (requestedSize <= 76) return `/icons/ios/76.png`;
    if (requestedSize <= 80) return `/icons/ios/80.png`;
    if (requestedSize <= 87) return `/icons/ios/87.png`;
    if (requestedSize <= 96) return `/icons/android/android-launchericon-96-96.png`;
    if (requestedSize <= 100) return `/icons/ios/100.png`;
    if (requestedSize <= 114) return `/icons/ios/114.png`;
    if (requestedSize <= 120) return `/icons/ios/120.png`;
    if (requestedSize <= 128) return `/icons/ios/128.png`;
    if (requestedSize <= 144) return `/icons/android/android-launchericon-144-144.png`;
    if (requestedSize <= 152) return `/icons/ios/152.png`;
    if (requestedSize <= 167) return `/icons/ios/167.png`;
    if (requestedSize <= 180) return `/icons/ios/180.png`;
    if (requestedSize <= 192) return `/icons/android/android-launchericon-192-192.png`;
    if (requestedSize <= 256) return `/icons/ios/256.png`;
    if (requestedSize <= 512) return `/icons/android/android-launchericon-512-512.png`;
    
    // For very large sizes, use the highest quality available
    return `/icons/ios/1024.png`;
  };

  const iconPath = getIconPath(size);

  return (
    <img
      src={iconPath}
      alt={alt}
      width={size}
      height={size}
      className={`${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

// Predefined icon sizes for common use cases
export const AppIcon = {
  Small: (props: Omit<IconProps, 'size'>) => <Icon size={24} {...props} />,
  Medium: (props: Omit<IconProps, 'size'>) => <Icon size={48} {...props} />,
  Large: (props: Omit<IconProps, 'size'>) => <Icon size={72} {...props} />,
  XLarge: (props: Omit<IconProps, 'size'>) => <Icon size={144} {...props} />,
};