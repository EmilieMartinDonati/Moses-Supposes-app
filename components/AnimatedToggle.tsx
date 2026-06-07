import { Colors } from "@/constants/theme";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";


export default function AnimatedToggle({
    leftValue, rightValue, currentValue, leftIcon, rightIcon, leftLabel, rightLabel, handleChange
}: {
    leftValue: string,
    rightValue: string,
    leftIcon: string,
    rightIcon: string,
    leftLabel: string,
    rightLabel: string,
    currentValue: string
    handleChange: (value: string) => void
}) {

    const leftActive = currentValue === leftValue

    const anim = useRef(new Animated.Value(leftActive ? 0 : 1)).current;

    const toggle = () => {
        const next = leftActive
        Animated.timing(anim, {
            toValue: next ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
        handleChange(next ? rightValue : leftValue);
    };

    const trackColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.light.honey, Colors.light.mainBlue],
    });

    const thumbLeft = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [3, 27],
    });

    return (
        <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, leftActive && styles.toggleLabelActive]}>
                {leftIcon}{" "}
                <Text style={styles.textLabel}>{leftLabel}</Text>
            </Text>
            <Pressable onPress={toggle} accessibilityRole="switch" accessibilityState={{ checked: !leftActive }}>
                <Animated.View style={[styles.toggleTrack, { backgroundColor: trackColor }]} />
                <Animated.View style={[styles.toggleThumb, { left: thumbLeft }]} />
            </Pressable>
            <Text style={[styles.toggleLabel, !leftActive && styles.toggleLabelActive]}>
                {rightIcon}{" "}
                <Text style={styles.textLabel}>{rightLabel}</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: Colors.light.faintWarmWhite,
        borderRadius: 10,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    toggleLabel: {
        fontSize: 14,
        color: Colors.light.chocolate,
        opacity: 0.4,
        fontWeight: "500"
    },
    toggleLabelActive: {
        opacity: 1,
        fontWeight: "700"
    },
    toggleTrack: {
        width: 50,
        height: 26,
        borderRadius: 13,
        justifyContent: "center",
    },
    toggleThumb: {
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
        top: 3,
    },
    textLabel: {
        textTransform: "capitalize"
    }
})