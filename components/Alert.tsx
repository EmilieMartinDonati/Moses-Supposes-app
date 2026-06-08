import { Colors } from "@/constants/theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, View } from "react-native";

const iconMapping = {
    "info": "info-circle",
    "error": "info-circle",
    "warning": "info-circle",
    "success": "info-circle"
} as const

const variants = {
    "info": {
        backgroundColor: Colors.light.mainBlue,
        color: Colors.light.faintWarmWhite
    },
    "error": {
        backgroundColor: Colors.light.paleRose,
        color: Colors.light.redError
    },
    "warning": {
        backgroundColor: Colors.light.mainBeige,
        color: Colors.light.honey
    },
    "success": {
        backgroundColor: Colors.light.waterGreen,
        color: Colors.light.forestGreen
    }
} as const

type VariantType = keyof typeof variants

export default function Alert({
    variant,
    onClick,
    visible = true,
    width,
    height,
    content
}: {
    variant: VariantType,
    onClick?: () => void,
    visible?: boolean,
    width: number,
    height: number,
    content: string
}) {

    if (!visible) {
        return null
    }

    return (<View style={[styles.alertContainer, {
         backgroundColor: variants[variant].backgroundColor
    }]}>
            <AntDesign
                name={iconMapping[variant]}
                size={16}
                color={variants[variant].color} />
        <Text style={[
            styles.text, { color: variants[variant].color }
        ]}>{content}</Text>
    </View>)

}

const styles = StyleSheet.create({
    alertContainer: {
        borderRadius: 10,
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 16,
        padding: 16
    },
    text: {
        fontSize: 12,
        textAlign: "justify"
    }
})