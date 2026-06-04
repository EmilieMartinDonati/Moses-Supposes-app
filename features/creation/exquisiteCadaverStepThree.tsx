import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Platform, Pressable, Text, View } from "react-native";
import ExquisiteCadaverRecap from './exquisiteCadaverRecap';

export default function ExquisiteCadaverStepThree({
    control, visibility, values
}: { control: any, visibility: "private" | "public", errors: any, values: any }) {


    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)

    if (visibility === "private") {
        return <ExquisiteCadaverRecap values={values} />
    }

    return (
        <View>
            <Controller
                control={control}
                name="start_time"
                render={({ field: { value, onChange } }) =>
                (
                    <View>
                        <Pressable onPress={() => setShowStartPicker(!showStartPicker)}><Text>Choisir l'heure de début</Text></Pressable>
                        {showStartPicker && (
                            Platform.OS === 'web' ? (
                                <input
                                    type="datetime-local"
                                    onChange={(e) => onChange(new Date(e.target.value))}
                                />
                            ) : (
                                <DateTimePicker
                                    value={value ?? new Date()}
                                    mode="datetime"
                                    display="spinner"
                                    onChange={(e, date) => {
                                        setShowStartPicker(false)
                                        onChange(date)
                                    }}
                                />
                            )
                        )}
                    </View>
                )
                } />
            <Controller
                control={control}
                name="end_time"
                render={({ field: { value, onChange } }) =>
                (
                    <View>
                        <Pressable onPress={() => setShowEndPicker(!showEndPicker)}><Text>Choisir l'heure de fin</Text></Pressable>
                        {showEndPicker && (
                            Platform.OS === 'web' ? (
                                <input
                                    type="datetime-local"
                                    onChange={(e) => onChange(new Date(e.target.value))}
                                />
                            ) : (
                                <DateTimePicker
                                    value={value ?? new Date()}
                                    mode="datetime"
                                    display="spinner"
                                    onChange={(e, date) => {
                                        setShowEndPicker(false)
                                        onChange(date)
                                    }}
                                />
                            )
                        )}
                    </View>
                )
                } />
        </View>
    )
}