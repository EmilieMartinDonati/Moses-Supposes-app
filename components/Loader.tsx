import { StyleSheet, View } from "react-native"

export default function Loader () {

    return (
        <View style={styles.spinner}>
        </View>
    )
}

const styles = StyleSheet.create({
    spinner: {
        width: 20,
        height: 20,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 1
    }})