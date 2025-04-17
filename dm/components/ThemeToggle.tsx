import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { MoonStar } from '~/lib/icons/MoonStar';
import { Sun } from '~/lib/icons/Sun';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

// Define props for ThemeToggle
interface ThemeToggleProps {
  size?: number; // Add optional size prop
}

// Add size prop, default to 24 if not provided
export function ThemeToggle({ size = 24 }: ThemeToggleProps) {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
    <Pressable
      onPress={toggleColorScheme}
      className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
    >
      {({ pressed }) => (
        <View
          className={cn(
            'pt-0.5 justify-center items-center',
            pressed && 'opacity-70'
          )}
        >
          {isDarkColorScheme ? (
            // Use the size prop
            <MoonStar className='text-foreground' size={size} strokeWidth={1.25} />
          ) : (
            // Use the size prop
            <Sun className='text-foreground' size={size} strokeWidth={1.25} />
          )}
        </View>
      )}
    </Pressable>
  );
}
