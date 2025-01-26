import {
    Image,
    StyleSheet,
    View,
    Animated,
    PanResponder,
    PanResponderGestureState,
    GestureResponderEvent,
    Dimensions,
    ImageSourcePropType,
} from "react-native";
import React, { useRef } from "react";

interface Boundaries {
    horizontalBoundary: number;
    verticalBoundary: number;
}

export default function Explore(): JSX.Element {
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const lastScale = useRef<number>(1);
    const lastDistance = useRef<number>(0);
    
    // Get screen dimensions
    const screenWidth: number = Dimensions.get('window').width;
    const screenHeight: number = Dimensions.get('window').height;

    // Calculate boundaries based on scale
    const getBoundaries = (scaleValue: number): Boundaries => {
        const horizontalBoundary: number = (screenWidth * (scaleValue - 1)) / 2;
        const verticalBoundary: number = (screenHeight * (scaleValue - 1)) / 2;
        return { horizontalBoundary, verticalBoundary };
    };

    // Clamp value between boundaries
    const clamp = (value: number, min: number, max: number): number => {
        return Math.min(Math.max(value, min), max);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
                pan.setValue({ x: 0, y: 0 });
            },

            onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                // Handle pinch to zoom
                if (event.nativeEvent.changedTouches && event.nativeEvent.changedTouches.length > 1) {
                    const touch1 = event.nativeEvent.changedTouches[0];
                    const touch2 = event.nativeEvent.changedTouches[1];

                    const currentDistance: number = Math.sqrt(
                        Math.pow(touch2.pageX - touch1.pageX, 2) +
                        Math.pow(touch2.pageY - touch1.pageY, 2)
                    );

                    if (lastDistance.current === 0) {
                        lastDistance.current = currentDistance;
                    }

                    const newScale: number = (currentDistance / lastDistance.current) * lastScale.current;
                    
                    // Limit scale between 1 and 4
                    if (newScale >= 1 && newScale <= 4) {
                        scale.setValue(newScale);
                        
                        // Adjust pan position when scaling to keep image centered
                        const { horizontalBoundary, verticalBoundary } = getBoundaries(newScale);
                        pan.x.setValue(clamp(pan.x._value, -horizontalBoundary, horizontalBoundary));
                        pan.y.setValue(clamp(pan.y._value, -verticalBoundary, verticalBoundary));
                    }
                } 
                // Handle panning
                else {
                    const { horizontalBoundary, verticalBoundary } = getBoundaries(scale._value);
                    
                    // Calculate new position with boundaries
                    const newX: number = pan.x._offset + gestureState.dx;
                    const newY: number = pan.y._offset + gestureState.dy;
                    
                    // Apply boundaries
                    pan.x.setValue(clamp(gestureState.dx, -horizontalBoundary - pan.x._offset, horizontalBoundary - pan.x._offset));
                    pan.y.setValue(clamp(gestureState.dy, -verticalBoundary - pan.y._offset, verticalBoundary - pan.y._offset));
                }
            },

            onPanResponderRelease: () => {
                lastScale.current = scale._value;
                lastDistance.current = 0;
                pan.flattenOffset();

                // Snap back to boundaries if needed
                const { horizontalBoundary, verticalBoundary } = getBoundaries(scale._value);
                
                Animated.parallel([
                    Animated.spring(pan.x, {
                        toValue: clamp(pan.x._value, -horizontalBoundary, horizontalBoundary),
                        useNativeDriver: false,
                        bounciness: 0,
                    }),
                    Animated.spring(pan.y, {
                        toValue: clamp(pan.y._value, -verticalBoundary, verticalBoundary),
                        useNativeDriver: false,
                        bounciness: 0,
                    }),
                ]).start();
            },
        })
    ).current;

    const imageSource: ImageSourcePropType = require("../../assets/images/map_dark.png");

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Animated.View
                    style={[
                        styles.zoomableView,
                        {
                            transform: [
                                { translateX: pan.x },
                                { translateY: pan.y },
                                { scale: scale },
                            ],
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <Image
                        source={imageSource}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    zoomableView: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    submitButton: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    submitButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
    },
});