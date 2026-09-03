import { getCurrentUser } from "@/lib/session";
import GuestPrompt from "@/components/auth/GuestPrompt";
import CarCreateForm from "@/components/cars/CarCreateForm";

export default async function NewCarPage() {
    const user = await getCurrentUser();

    if (!user) {
        return <GuestPrompt message="Log in to post a build." />;
    }

    return <CarCreateForm />;
}
