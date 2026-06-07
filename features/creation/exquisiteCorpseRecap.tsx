import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExquisiteCorpseCode from "./ExquisiteCorpseCode";

// ─── Recap Row ────────────────────────────────────────────────────────────────

function RecapRow({ label, value, isLast }: { label: string; value: string | number | undefined, isLast?: boolean }) {
    if (value === undefined || value === null || value === "") return null;
    return (
        <View style={[rowStyles.container, isLast && { borderBottomWidth: 0 }]}>
            <Text style={rowStyles.label}>{label}</Text>
            <Text style={rowStyles.value}>{value}</Text>
        </View>
    );
}

const rowStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.elevatedBeige,
        gap: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.5,
        textTransform: "uppercase",
        color: Colors.light.chocolate,
        opacity: 0.5,
        flex: 1
    },
    value: {
        fontSize: 14,
        color: Colors.light.chocolate,
        fontWeight: "500",
        flex: 2,
        textAlign: "right"
    },
});

// ─── Section ──────────────────────────────────────────────────────────────────

function RecapSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={sectionStyles.container}>
            <Text style={sectionStyles.title}>{title}</Text>
            {children}
        </View>
    );
}

const sectionStyles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.faintWarmWhite,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.light.elevatedBeige,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        gap: 0,
    },
    title: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: Colors.light.mainBlue,
        marginBottom: 4
    },
});

// ─── Recap ────────────────────────────────────────────────────────────────────

function formatDate(date: Date | string | undefined): string | undefined {
    if (!date) return undefined;
    return new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ExquisiteCorpseRecap({ values }: { values: any }) {
    const isPublic = values.visibility === "public";
    const code = values.access_code

    return (
        <SafeAreaView style={styles.container}>
            {code && <Text style={styles.heading}>Votre code d'accès</Text>}
            {code && <ExquisiteCorpseCode code={code} /> }
            <Text style={styles.heading}>Récapitulatif</Text>
            <RecapSection title="Contenu">
                <RecapRow label="Titre" value={values.title} />
                <RecapRow label="Prompt" value={values.prompt} />
                <RecapRow label="Visibilité" value={isPublic ? "🌐 Public" : "🔒 Privé"} isLast/>
            </RecapSection>

            <RecapSection title="Paramètres">
                <RecapRow label="Délai d'écriture" value={values.writingDelay ? `${values.writingDelay} s` : undefined} />
                <RecapRow label="Phrases max / participant" value={values.max_sentences} />
                {isPublic && <RecapRow label="Participants max" value={values.max_participants} isLast/>}
                {!isPublic && <RecapRow label="Tours / participant" value={values.iterations_count} isLast/>}
            </RecapSection>

            {isPublic && (
                <RecapSection title="Dates">
                    <RecapRow label="Début" value={formatDate(values.start_time)} />
                    <RecapRow label="Fin" value={formatDate(values.end_time)} isLast />
                </RecapSection>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.light.chocolate
    },
    subheading: {
        fontSize: 13,
        color: Colors.light.chocolate,
        opacity: 0.45,
        lineHeight: 19,
        marginTop: -8
    },
});
