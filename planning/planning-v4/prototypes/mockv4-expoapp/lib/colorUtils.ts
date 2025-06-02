/**
 * Utility to extract hex color values from Tailwind class names
 */

// Common Tailwind colors used in the app
const tailwindColorMap: Record<string, string> = {
  // Green
  'text-green-100': '#dcfce7',
  'text-green-200': '#bbf7d0',
  'text-green-300': '#86efac',
  'text-green-400': '#4ade80',
  'text-green-500': '#22c55e',
  
  // Gray
  'text-gray-100': '#f3f4f6',
  'text-gray-200': '#e5e7eb',
  'text-gray-300': '#d1d5db',
  'text-gray-400': '#9ca3af',
  'text-gray-500': '#6b7280',
  'text-gray-600': '#4b5563',
  'text-gray-700': '#374151',
  'text-gray-800': '#1f2937',
  'text-gray-900': '#111827',
  
  // Red
  'text-red-500': '#ef4444',
  
  // Add other colors as needed
};

/**
 * Takes a string containing Tailwind classes and extracts the color class if present
 * Returns the corresponding hex color or undefined if no color class is found
 */
export function tailwindColorToHex(classNames: string): string | undefined {
  // Split by spaces to handle multiple classes
  const classes = classNames.split(' ');
  
  // Find the first class that matches a color in our map
  for (const className of classes) {
    if (tailwindColorMap[className]) {
      return tailwindColorMap[className];
    }
  }
  
  // If we need to parse dynamically (like text-green-100)
  for (const className of classes) {
    if (className.startsWith('text-')) {
      // Try to find partial matches
      const matchingKeys = Object.keys(tailwindColorMap).filter(key => 
        className.includes(key.replace('text-', ''))
      );
      
      if (matchingKeys.length > 0) {
        return tailwindColorMap[matchingKeys[0]];
      }
    }
  }
  
  return undefined;
} 