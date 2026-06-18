import LoginFormContainer from "@/features/auth/LoginFormContainer";
import HomeHeader from "@/features/home/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HomeHeader title="Connexion" hideActions />
            <LoginFormContainer />
        </SafeAreaView>)
}