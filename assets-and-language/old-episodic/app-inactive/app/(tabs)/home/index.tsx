import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function HomeTabScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text className="text-xl">Home Content</Text>
    </View>
  );
} 