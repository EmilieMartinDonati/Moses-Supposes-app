import { logOutUser } from "@/actions/auth";
import { NavigationActions } from "@/actions/navigation";
import { Colors } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Action = {
  label: string;
  onClick: () => void;
  logo: number;
}

const guestActions: Action[] = [
  { label: "Connexion", logo: require("../../assets/images/anonymous_person_24.png"), onClick: NavigationActions.goToSignup },
]
const userActions: Action[] = [
  { label: "Déconnexion", logo: require("../../assets/images/logout_24.svg"), onClick: async () => logOutUser },
  { label: "Mon compte", logo: require("../../assets/images/anonymous_person_24.png"), onClick: () => { } },
  { label: "Explorer", logo: require("../../assets/images/anonymous_person_24.png"), onClick: () => console.log("open filter modals") }
]

export default function HomeHeader({ title, logo, user, hideActions = false }: {
  title: string, logo?: string, user?: any, hideActions?: boolean
}) {

  const [actions, setActions] = useState<Action[]>([])

  useEffect(() => {
    if (user) {
      setActions(userActions)
    }
    else {
      setActions(guestActions)
    }
  }, [user])

  return (
    <View style={styles.header}>
      <View style={styles.leftContent}>
        {logo ? (
          <Image source={{ uri: logo }} style={styles.logo} />
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        {!user && !hideActions &&
          <View style={styles.actionsContainer}>
            {actions.map(({ onClick, logo, label }: Action) => (
              <Pressable
                key={label}
                onPress={onClick}>
                <Image source={logo} style={styles.actionsLogo} />
              </Pressable>
            )
            )}
          </View>
        }
        {user && !hideActions &&
          <Text>Todo</Text>}
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
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  actionsContainer: {
    gap: 8,
    flexDirection: "row"
  },
  actionsLogo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  }
});