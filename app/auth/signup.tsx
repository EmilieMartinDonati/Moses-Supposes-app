import SignupFormContainer from "@/features/auth/SignupFormContainer";
import HomeHeader from "@/features/home/HomeHeader";

export default function Signup() {
    return (
        <>
        <HomeHeader title="Création de compte" hideActions />
            <SignupFormContainer />
        </>
    )
}