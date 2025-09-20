import { createClient } from "./client";

export const petSearch = async (props: string) => {
    const supabase = createClient()
    let data, error;

    if (!props) {
        // default * 
        ({ data, error } = await supabase
            .from("Pets")
            .select("*"));

    } else {
        // search if query is sent
        ({ data, error } = await supabase
            .from("Pets")
            .select("*")
            .or(`breed.ilike.%${props}%,family.ilike.%${props}%,description.ilike.%${props}%`));
    }

    if (error) {
        console.error(error);
        return [];
    }

    return (data ?? []).sort(() => Math.random() - 0.5);
}