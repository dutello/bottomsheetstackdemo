import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Animated, TouchableWithoutFeedback } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  // Refs for both bottom sheets
  const bottomSheet1Ref = useRef(null);
  const bottomSheet2Ref = useRef(null);

  // Animated values for overlays
  const overlayOpacity1 = useRef(new Animated.Value(0)).current;
  const overlayOpacity2 = useRef(new Animated.Value(0)).current;

  // State to manage if bottom sheets are open
  const [isSheet1Open, setIsSheet1Open] = useState(false);
  const [isSheet2Open, setIsSheet2Open] = useState(false);

  // Snap points for bottom sheets (First is taller)
  const snapPoints1 = useMemo(() => ['40%', '60%'], []); // Adjusted for taller first bottom sheet
  const snapPoints2 = useMemo(() => ['30%', '50%'], []);

  // Handlers to open bottom sheets
  const openBottomSheet1 = useCallback(() => {
    Animated.timing(overlayOpacity1, {
      toValue: 1, // Fade in
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSheet1Open(true);
    bottomSheet1Ref.current?.expand();
  }, [overlayOpacity1]);

  const openBottomSheet2 = useCallback(() => {
    Animated.timing(overlayOpacity2, {
      toValue: 1, // Fade in
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSheet2Open(true);
    bottomSheet2Ref.current?.expand();
  }, [overlayOpacity2]);

  // Handle closing the bottom sheets
  const handleCloseBottomSheet1 = useCallback(() => {
    Animated.timing(overlayOpacity1, {
      toValue: 0, // Fade out
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsSheet1Open(false);
      bottomSheet1Ref.current?.close();
    });
  }, [overlayOpacity1]);

  const handleCloseBottomSheet2 = useCallback(() => {
    Animated.timing(overlayOpacity2, {
      toValue: 0, // Fade out
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsSheet2Open(false);
      bottomSheet2Ref.current?.close();
    });
  }, [overlayOpacity2]);

  // Function to handle overlay tap
  const handleOverlayTap = (sheetRef, setIsOpen) => {
    setIsOpen(false);
    sheetRef.current?.close(); // Close the bottom sheet when overlay is tapped
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Button title="Open Bottom Sheet 1" onPress={openBottomSheet1} />
        <Button title="Open Bottom Sheet 2" onPress={openBottomSheet2} />

        {/* First Bottom Sheet */}
        {isSheet1Open && (
          <TouchableWithoutFeedback onPress={() => handleOverlayTap(bottomSheet1Ref, setIsSheet1Open)}>
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: overlayOpacity1,
                  zIndex: 0, // Ensure it's below the bottom sheet
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        <BottomSheet
          ref={bottomSheet1Ref}
          index={-1}
          snapPoints={snapPoints1}
          enablePanDownToClose
          onClose={handleCloseBottomSheet1}
          onChange={(index) => {
            if (index === -1) {
              Animated.timing(overlayOpacity1, {
                toValue: 0, // Fade out
                duration: 300,
                useNativeDriver: true,
              }).start(() => setIsSheet1Open(false));
            }
          }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Bottom Sheet 1</Text>
            <Button title="Open Bottom Sheet 2" onPress={openBottomSheet2} />
            <Button title="Close" onPress={handleCloseBottomSheet1} />
          </View>
        </BottomSheet>

        {/* Second Bottom Sheet */}
        {isSheet2Open && (
          <TouchableWithoutFeedback onPress={() => handleOverlayTap(bottomSheet2Ref, setIsSheet2Open)}>
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: overlayOpacity2,
                  zIndex: 0, // Ensure it's below the bottom sheet
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        <BottomSheet
          ref={bottomSheet2Ref}
          index={-1}
          snapPoints={snapPoints2}
          enablePanDownToClose
          onClose={handleCloseBottomSheet2}
          onChange={(index) => {
            if (index === -1) {
              Animated.timing(overlayOpacity2, {
                toValue: 0, // Fade out
                duration: 300,
                useNativeDriver: true,
              }).start(() => setIsSheet2Open(false));
            }
          }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Bottom Sheet 2</Text>
            <Button title="Close" onPress={handleCloseBottomSheet2} />
          </View>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default App;
