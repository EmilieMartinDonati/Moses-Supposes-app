import SignupFormContainer from "@/features/auth/SignupFormContainer";
import HomeHeader from "@/features/home/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader title="Création de compte" hideActions />
            <SignupFormContainer />
        </SafeAreaView>
    )
}