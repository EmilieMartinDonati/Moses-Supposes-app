import { Colors, Fonts } from "@/constants/theme";
import { Platform, StyleSheet, Text, View } from "react-native";

// ─── Recap Row ────────────────────────────────────────────────────────────────

function RecapRow({ label, value }: { label: string; value: string | number | undefined }) {
    if (value === undefined || value === null || value === "") return null;
    return (
        <View style={rowStyles.container}>
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
        flex: 1,
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
    },
    value: {
        fontSize: 14,
        color: Colors.light.chocolate,
        fontWeight: "500",
        flex: 2,
        textAlign: "right",
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
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
        marginBottom: 4,
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
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

export default function ExquisiteCadaverRecap({ values }: { values: any }) {
    const isPublic = values.visibility === "public";

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Récapitulatif</Text>
            <Text style={styles.subheading}>
                Vérifiez les informations avant de créer votre atelier.
            </Text>

            <RecapSection title="Contenu">
                <RecapRow label="Titre" value={values.title} />
                <RecapRow label="Prompt" value={values.prompt} />
                <RecapRow label="Visibilité" value={isPublic ? "🌐 Public" : "🔒 Privé"} />
            </RecapSection>

            <RecapSection title="Paramètres">
                <RecapRow label="Délai d'écriture" value={values.writingDelay ? `${values.writingDelay} s` : undefined} />
                <RecapRow label="Phrases max / participant" value={values.max_sentences} />
                {isPublic && <RecapRow label="Participants max" value={values.max_participants} />}
                {!isPublic && <RecapRow label="Tours / participant" value={values.iterations_count} />}
            </RecapSection>

            {isPublic && (
                <RecapSection title="Dates">
                    <RecapRow label="Début" value={formatDate(values.start_time)} />
                    <RecapRow label="Fin" value={formatDate(values.end_time)} />
                </RecapSection>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    heading: {
        fontSize: 22,
        fontWeight: "600",
        color: Colors.light.chocolate,
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
    },
    subheading: {
        fontSize: 13,
        color: Colors.light.chocolate,
        opacity: 0.45,
        lineHeight: 19,
        marginTop: -8,
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
    },
});
