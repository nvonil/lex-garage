import { getCurrentUser } from "@/lib/session";
import GuestPrompt from "@/components/GuestPrompt";
import NewCarForm from "@/components/NewCarForm";

export default async function NewCarPage() {
    const user = await getCurrentUser();

    if (!user) {
        return <GuestPrompt message="Log in to post a build." />;
    }

    return <NewCarForm />;
}
