// index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  async function requestMicrophonePermission() {
    try {
      const status = await Audio.requestPermissionsAsync();
      setHasPermission(status.status === 'granted');
      console.log(status)
      if (status.status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone access is required for this feature.');
      }
    } catch (error) {
      console.error('Error requesting microphone permissions:', error);
    }
  }

  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello World</Text>
      <Text>Microphone Permission Status: {hasPermission ? 'Granted' : 'Not Granted'}</Text>

      <Button
        title="Request Microphone Permission"
        onPress={requestMicrophonePermission}
      />
    </View>
  );
}
