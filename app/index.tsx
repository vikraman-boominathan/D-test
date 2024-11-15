import React, { useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';

const AudioRecorder = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status ? true : false);


      if (status !== 'granted') {
        console.log('Permission to access microphone denied');
        return;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      recording.startAsync();
      setRecording(true);
      setPaused(false);
      setIsStopped(false);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const pauseRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.pauseAsync();
        setPaused(true);
      }
    } catch (error) {
      console.error('Failed to pause recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        setRecording(false);
        setPaused(false);
        setIsStopped(true);
        setRecordingUri(uri);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const resumeRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.startAsync();
        setPaused(false);
      }
    } catch (error) {
      console.error('Failed to resume recording', error);
    }
  };

  const playRecording = async () => {
    if (recordingUri) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: recordingUri },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setIsPlaying(true);

        // Listen to the sound playback state and reset when done
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.error('Failed to play recording', error);
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Microphone Permission Status: {hasPermission ? 'Granted' : 'Not Granted'}</Text>

      <Text>{recording ? 'Recording...' : paused ? 'Paused' : 'Ready to Record'}</Text>
      <Button title="Start Recording" onPress={startRecording} disabled={recording} />
      <Button title="Pause Recording" onPress={pauseRecording} disabled={!recording || paused} />
      <Button title="Resume Recording" onPress={resumeRecording} disabled={!paused} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />

      <Button title="Play Recording" onPress={playRecording} disabled={!recordingUri || isPlaying} />

      {recordingUri && <Text>Recording saved at: {recordingUri}</Text>}
    </View>
  );
};

export default AudioRecorder;
