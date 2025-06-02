# DarkMallardLoadingScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
  withSpring,
  useAnimatedProps
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// For TypeScript support, create these components
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Get device dimensions
const { width, height } = Dimensions.get('window');

const DarkMallardLoadingScreen = ({ progress = 0, onLoadComplete }) => {
  // Shared values for animations
  const scanLinePosition = useSharedValue(0);
  const textProgress = useSharedValue(0);
  const loadingBarWidth = useSharedValue(0);
  const pulseOpacity = useSharedValue(1);
  const securityLevel = useSharedValue(1);
  const logoScale = useSharedValue(0.95);
  
  // Full text to be "decrypted"
  const fullText = "ESTABLISHING SECURE CONNECTION...";
  
  // Update loading bar based on actual progress
  useEffect(() => {
    loadingBarWidth.value = withTiming(progress, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Update security level based on progress
    if (progress >= 80 && securityLevel.value < 5) {
      securityLevel.value = 5;
      runOnJS(triggerHaptic)();
    } else if (progress >= 60 && securityLevel.value < 4) {
      securityLevel.value = 4;
      runOnJS(triggerHaptic)();
    } else if (progress >= 40 && securityLevel.value < 3) {
      securityLevel.value = 3;
      runOnJS(triggerHaptic)();
    } else if (progress >= 20 && securityLevel.value < 2) {
      securityLevel.value = 2;
      runOnJS(triggerHaptic)();
    }
    
    // When loading is complete
    if (progress >= 100 && onLoadComplete) {
      // Trigger completion after a small delay
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onLoadComplete();
      }, 500);
    }
  }, [progress]);
  
  // Trigger light haptic feedback
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Start animations on mount
  useEffect(() => {
    // Scan line animation
    scanLinePosition.value = withRepeat(
      withTiming(100, {
        duration: 2000,
        easing: Easing.linear
      }),
      -1, // Infinite repetitions
      false // Don't reverse the animation
    );

    // Text decryption animation
    textProgress.value = withTiming(100, {
      duration: 3000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    // Pulse animation for various elements
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    
    // Logo subtle animation
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1, { 
          duration: 1500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        }),
        withTiming(0.95, { 
          duration: 1500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        })
      ),
      -1,
      true
    );
  }, []);
  
  // Animated style for scan line
  const scanLineStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: 'rgba(220, 38, 38, 0.7)',
      top: `${scanLinePosition.value}%`,
      // Note: shadowColor on Android requires elevation
      shadowColor: '#dc2626',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 5
    };
  });
  
  // Animated text rendering
  const renderAnimatedText = () => {
    const AnimatedTextDisplay = useAnimatedStyle(() => {
      const textLength = Math.floor(interpolate(
        textProgress.value,
        [0, 100],
        [0, fullText.length]
      ));

      return {
        opacity: interpolate(textProgress.value, [0, 15], [0, 1]),
      };
    });
    
    return (
      <View style={styles.textContainer}>
        <AnimatedText style={[styles.terminalText, AnimatedTextDisplay]}>
          {">"}
        </AnimatedText>
        <View style={styles.textContentContainer}>
          <AnimatedText style={[styles.terminalText, AnimatedTextDisplay]}>
            {fullText.substring(0, useSharedValue(Math.floor(interpolate(
              textProgress.value,
              [0, 100],
              [0, fullText.length]
            ))).value)}
          </AnimatedText>
          <Animated.View 
            style={[
              styles.cursor, 
              useAnimatedStyle(() => ({
                opacity: pulseOpacity.value
              }))
            ]} 
          />
        </View>
      </View>
    );
  };
  
  // Animated properties for the logo
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }]
    };
  });
  
  // Progress bar animated style
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${loadingBarWidth.value}%`,
      backgroundColor: interpolate(
        loadingBarWidth.value,
        [0, 50, 100],
        ['#991b1b', '#991b1b', '#065f46']
      )
    };
  });
  
  // Security level text animation
  const securityLevelText = useAnimatedStyle(() => {
    return {
      opacity: 1
    };
  });
  
  // Status indicators
  const renderStatusIndicator = (threshold, label) => {
    const indicatorStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: progress >= threshold ? '#065f46' : '#991b1b',
        opacity: progress >= threshold ? 1 : 0.5
      };
    });

    return (
      <View style={styles.statusItem}>
        <Animated.View style={[styles.statusDot, indicatorStyle]} />
        <Text style={styles.statusText}>
          {label}: {progress >= threshold ? 'ACTIVE' : 'PENDING'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/*Background grid pattern*/}
      <View style={styles.gridBackground} />

      {/* Classified overlay */}
      <View style={styles.classifiedOverlay}>
        <View style={styles.classifiedBadge}>
          <Text style={styles.classifiedText}>CLASSIFIED</Text>
        </View>
      </View>
      
      {/* Main content */}
      <View style={styles.contentContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Animated.View style={logoAnimatedStyle}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>DARK MALLARD</Text>
              <Text style={styles.logoSubtext}>LANGUAGE ACQUISITION DIVISION</Text>
            </View>
          </Animated.View>
        </View>
        
        {/* Duck silhouette */}
        <View style={styles.duckContainer}>
          <Svg width={80} height={80} viewBox="0 0 200 200" style={styles.duckSvg}>
            <Path
              fill="#991b1b"
              d="M100,20 C60,20 40,50 40,90 C40,110 50,130 70,140 L60,180 L80,160 L100,180 L120,160 L140,180 L130,140 C150,130 160,110 160,90 C160,50 140,20 100,20 Z M80,70 C85,70 90,75 90,80 C90,85 85,90 80,90 C75,90 70,85 70,80 C70,75 75,70 80,70 Z"
            />
            <Animated.View style={scanLineStyle} />
          </Svg>
        </View>
        
        {/* Loading text */}
        {renderAnimatedText()}
        
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
          </View>
          <Text style={styles.progressText}>
            {progress >= 100 ? 'CONNECTION SECURE' : `${Math.floor(progress)}%`}
          </Text>
        </View>
        
        {/* Status details */}
        <View style={styles.statusContainer}>
          {renderStatusIndicator(30, 'ENCRYPTION')}
          {renderStatusIndicator(50, 'ASSETS')}
          {renderStatusIndicator(70, 'INTEL')}
          {renderStatusIndicator(90, 'UPLINK')}
        </View>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <AnimatedText style={[styles.footerText, securityLevelText]}>
          SECURITY LEVEL: {Math.floor(progress / 20) + 1}/5
        </AnimatedText>
        <Text style={styles.footerText}>
          ACCESS CODE: {Math.floor(Math.random() * 900000) + 100000}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1A2C',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    borderWidth: 1,
    borderColor: 'rgba(153, 27, 27, 0.1)',
    // Will use after mounting to add grid lines
  },
  classifiedOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    transform: [{ rotate: '12deg' }],
    opacity: 0.1,
  },
  classifiedBadge: {
    borderWidth: 2,
    borderColor: '#991b1b',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  classifiedText: {
    color: '#991b1b',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoBox: {
    position: 'relative',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#991b1b',
    letterSpacing: 3,
    textAlign: 'center',
  },
  logoSubtext: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#6B7280',
    letterSpacing: 1,
    marginTop: 5,
    textAlign: 'center',
  },
  duckContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  duckSvg: {
    // SVG styles
  },
  textContainer: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  terminalText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#D1D5DB',
  },
  textContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  cursor: {
    width: 8,
    height: 16,
    backgroundColor: '#D1D5DB',
    marginLeft: 2,
  },
  progressBarContainer: {
    width: width *0.8,
    maxWidth: 300,
    height: 16,
    marginBottom: 30,
    position: 'relative',
  },
  progressBarBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#991b1b',
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#D1D5DB',
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: width* 0.8,
    maxWidth: 300,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#9CA3AF',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 4,
  },
});

export default DarkMallardLoadingScreen;
