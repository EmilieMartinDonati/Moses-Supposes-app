import { Colors } from '@/constants/theme'
import { useEffect } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

export default function ExpandingChip({
    initialColor = Colors.light.honey,
    targetColor = Colors.light.paleRose,
    shouldExpand = false,
    initialContent = "+",
    targetContent = "Créer votre propre atelier !",
    onClick
}: {
    onClick?: () => void,
    initialColor?: string,
    targetColor?: string,
    shouldExpand: boolean,
    icon?: string,
    initialContent: string,
    targetContent: string,
}) {

    const Container = onClick ? Pressable : View

    const width = useSharedValue(50)
    const colorProgress = useSharedValue(0)
    const textProgress = useSharedValue(1)

    useEffect(() => {
        const isExpanding = shouldExpand

        colorProgress.value = withSpring(isExpanding ? 1 : 0)

        if (isExpanding) {
            textProgress.value = 0

            width.value = withSpring(320, {}, (finished) => {
                if (finished) {
                    textProgress.value = withTiming(1, { duration: 100 })
                }
            })

        } else {
            textProgress.value = withTiming(0, { duration: 120 })

            width.value = withSpring(50)
        }
    }, [shouldExpand])

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            colorProgress.value,
            [0, 1],
            [initialColor, targetColor]
        )

        return {
            width: width.value,
            height: 50,
            backgroundColor
        }
    })

    const animatedInitialTextStyle = useAnimatedStyle(() => {
        return {
            opacity: 1 - textProgress.value,
            position: "absolute"
        }
    })

    const animatedTargetTextStyle = useAnimatedStyle(() => {
        return {
            opacity: textProgress.value,
            position: "absolute"
        }
    })

    return (
        <Container onPress={onClick}>
            <Animated.View style={[styles.chip, animatedStyle]}>
                <Animated.Text style={[styles.text, animatedInitialTextStyle]}>
                    {initialContent}
                </Animated.Text>
                <Animated.Text
                    style={[styles.text, animatedTargetTextStyle]}>
                    {targetContent}
                </Animated.Text>
            </Animated.View>
        </Container>
    )

}

const styles = StyleSheet.create({
    chip: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderRadius: 25,
        overflow: "hidden"
    },
    text: {
        fontSize: 18,
        color: Colors.light.chocolate,
        textAlign: "center"
    }
})