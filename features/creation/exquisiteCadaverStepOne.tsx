import { Colors } from "@/constants/theme";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ExquisiteCadaverStepOne({
    control, errors
}: { control: any, errors: any }) {
    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Titre</Text>
            <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Titre de votre cadavre exquis"
                        placeholderTextColor={Colors.light.chocolate}
                        underlineColorAndroid="transparent"
                        multiline
                        style={styles.textInput}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.title && <Text style={{ color: 'red' }}>{errors.title.message}</Text>}
            <Text style={styles.label}>Prompt</Text>
            <Controller
                control={control}
                name="prompt"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Prompt de votre cadavre exquis"
                        placeholderTextColor={Colors.light.chocolate}
                        underlineColorAndroid="transparent"
                        multiline
                        style={styles.textInput}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.prompt && <Text style={{ color: 'red' }}>{errors.prompt.message}</Text>}
            <Text style={styles.label}>Visibilité</Text>
            <Controller
                control={control}
                name="visibility"
                render={({ field: { onChange, value } }) => (
                    <SegmentedControl
                        values={['Privé', 'Public']}
                        selectedIndex={value === 'public' ? 1 : 0}
                        onChange={event => onChange(
                            event.nativeEvent.selectedSegmentIndex === 1 ? 'public' : 'private')}
                    />
                )}
            />
        </View>)
}

const styles = StyleSheet.create({
    formContainer: {
        display: "flex",
        justifyContent: "center",
        gap: 16
    },
    textInput: {
        backgroundColor: Colors.light.faintWarmWhite,
        color: Colors.light.chocolate,
        padding: 8,
        borderRadius: 4,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 0.5
    },
    label: {
        fontWeight: "bold",
        color: Colors.light.chocolate
    }
})