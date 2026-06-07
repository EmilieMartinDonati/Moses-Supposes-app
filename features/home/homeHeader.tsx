import { Colors } from "@/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";

/* Actions in header will be login/logout filters session by type, category ... */

type Action = {
  label: string;
  onPress: () => void;
  renderView?: () => React.ReactNode;
}

type HeaderProps = {
  title: string;
  logo: string;
  actions: Action[]
};

export default function HomeHeader({ title, logo, actions }: HeaderProps) {

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {logo ? (
          <Image source={{ uri: logo }} style={styles.logo} />
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.light.mainBlue,
    color: "white",
    height: 55.5,
    borderRadius: 3
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
});