import { useEffect, useState } from "react";
import { Profile } from "../libs/types";
import { useAuth } from "../Login/LoginContext";

export default function Profiles() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorServer, setErrorServer] = useState<string | null>(null);
    const { role } = useAuth();

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            setError(null);
            setErrorServer(null);

            try {
                const response = await fetch(`http://localhost:3000/${role}`);
                if (response.status === 404) {
                    setErrorServer("A kért erőforrás nem található (404)!");
                    return;
                }
                if (!response.ok) {
                    setErrorServer(`Server responded with status ${response.status}`);
                    return;
                }

                const data = await response.json();
                setProfile(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [role]);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error}</p>;
    if (errorServer) return <p>{errorServer}</p>;

    return (
        <div>
            <h2>Profile</h2>
            <p>Name: {profile?.name}</p>
            <p>Email: {profile?.email}</p>
            <p>Role: {role}</p>
        </div>
    );
}
