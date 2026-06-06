import { supabase } from "./client";

import { adjectives, animals, NumberDictionary, uniqueNamesGenerator } from 'unique-names-generator';

/* ----------------------------------------------------------------
---------------------------- GET ----------------------------------
---------------------------------------------------------------- */

export async function getWritingWorkshopsByVisibility({ onlyPublic = false, visibility = "live" }: {
    onlyPublic?: boolean,
    visibility: "upcoming" | "live" | "finished"
}) {
    try {
        const now = new Date().toISOString()

        let query = supabase
            .from("exquisite_corpse_config")
            .select(onlyPublic
                ? "*, writing_workshops!inner(*), workshop_access!left(workshop_id)"
                : "*, writing_workshops!inner(*)"
            )
            .not('start_time', 'is', null)
            .order("start_time", { ascending: true })

        switch (visibility) {
            case "live":
                query = query.lt("start_time", now).gt("end_time", now)
                break;
            case "upcoming":
                query = query.gt("start_time", now)
                break;
            case "finished":
                query = query.lt("end_time", now)
                break;
        }

        if (onlyPublic) {
            query = query
                .eq("visibility", "public")
                .is("workshop_access.workshop_id", null)
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching writing workshops:", error);
            throw error;
        }

        return data?.map(({ writing_workshops, workshop_access, ...config }) => ({
            ...config,
            ...writing_workshops,
        })) ?? []
    }
    catch (error) {
        console.error("Unexpected error fetching writing workshops:", error);
        throw error;
    }
}

export const getWritingWorkshopById = async (writingWorkshopId: string) => {
    try {
        const { data: writingWorkshop, error } = await supabase.from("writing_workshops").select("*").eq("id", writingWorkshopId).single()

        if (error) {
            throw (error)
        }
        return writingWorkshop
    }
    catch (e) {
        console.error(`erreur getting writingWorkshopById with writingWorkshopId ${writingWorkshopId}`)
    }

}

export const getWritingWorkshopWithDetails = async (writingWorkshopId: string) => {
    try {
        const { data: writing_worshop, error } = await supabase
            .from("writing_workshops")
            .select("*")
            .eq("id", writingWorkshopId)
            .single()

        if (error) {
            console.error(`error getting writing workshop with id ${writingWorkshopId}`, error)
            throw error
        }

        const { data: exquisite_corpse_config, error: config_error } = await supabase
            .from("exquisite_corpse_config")
            .select("*")
            .eq("workshop_id", writingWorkshopId)
            .single()

        if (config_error) {
            console.error(`error getting exquisite corpse config for workshop id ${writingWorkshopId}`, config_error)
            throw config_error
        }

        const { data: workshop_access, error: workshop_acces_error } = await supabase
            .from("workshop_access")
            .select("*")
            .eq("workshop_id", writingWorkshopId)
            .single()

        if (workshop_acces_error && workshop_acces_error.code !== 'PGRST116') {
            console.error(`error getting workshop access for workshop id ${writingWorkshopId}`, workshop_acces_error)
            throw workshop_acces_error
        }

        const result = {
            ...writing_worshop,
            ...exquisite_corpse_config,
        }

        if (workshop_access) {
            result.access_type = workshop_access.type
            result.access_code = workshop_access.code
        }

        return result
    }
    catch (e) {
        console.error(`error getting workshop with details for id ${writingWorkshopId}`, e)
    }
}

/* ----------------------------------------------------------------
---------------------------- CREATE -------------------------------
---------------------------------------------------------------- */

export const generateUniqueCode = async (): Promise<string> => {

    const numbers = NumberDictionary.generate({ min: 10, max: 99 })

    const code = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, numbers],
        separator: '-',
        style: 'upperCase'
    })

    const used = await supabase.from("workshop_access").select("code").eq("code", code).single()

    if (used.data) {
        return generateUniqueCode()
    }

    return code
}

export const createWritingWorkshop = async (data: any) => {
    try {
        const { visibility, prompt, title } = data
        const writing_workshop_payload : {
            prompt: string,
            title: string,
            type: "exquisite_corpse" | "contest",
            creator_email?: string
        } = {
            prompt, title, type: "exquisite_corpse"
        }
        if (data.email) {
            writing_workshop_payload["creator_email"] = data.email
        }
        const { data: writing_workshop, error } = await supabase.from("writing_workshops").insert(writing_workshop_payload).select("*").single()

        if (error) {
            console.error("Error creating writing workshop:", error);
            throw error;
        }

        const workshop_id = writing_workshop.id
        const exquisite_corpse_config_payload: {
            workshop_id: string,
            writing_delay: number,
            max_sentences: number,
            visibility: "private" | "public",
            iterations_count?: number,
            max_participants?: number,
            start_time?: Date,
            end_time?: Date
        } = {
            workshop_id,
            writing_delay: data.writingDelay,
            max_sentences: data.max_sentences,
            visibility
        }
        if (data.iterations_count) {
            exquisite_corpse_config_payload["iterations_count"] = data.iterations_count
        }
        if (data.max_participants) {
            exquisite_corpse_config_payload["max_participants"] = data.max_participants
        }
        if (data.start_time) {
            exquisite_corpse_config_payload["start_time"] = data.start_time
        }
        if (data.end_time) {
            exquisite_corpse_config_payload["end_time"] = data.end_time
        }

        const { data: config, error: configError } = await supabase.from("exquisite_corpse_config").insert(exquisite_corpse_config_payload).select("*").single()

        if (configError) {
            console.error("Error creating exquisite corpse config:", configError);
            throw configError;
        }

        let access = null
        if (visibility === "private") {
            const code = await generateUniqueCode()
            const { data, error: accessError } = await supabase.from("workshop_access").insert({ workshop_id, code, type: "code" }).select("*").single()
            if (accessError) {
                console.error("Error creating workshop access:", accessError);
                throw accessError;
            }
            access = data
        }

        return {
            ...writing_workshop,
             writing_delay: config.writing_delay,
            max_sentences: config.max_sentences,
            visibility: config.visibility,
            iterations_count: config.iterations_count,
            max_participants: config.max_participants,
            start_time: config.start_time,
            end_time: config.end_time,
            access_type: access?.type,
            access_code: access?.code
        }
    }
    catch (e) {
        console.error("error creating writing workshop", e)
    }
}
/* ----------------------------------------------------------------
---------------------------- UPDATE -------------------------------
---------------------------------------------------------------- */