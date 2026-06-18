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

export const getWritingWorkshopById = async ({workshopId, select="*"}:{workshopId: string, select?: string}) => {
    return await supabase.from("writing_workshops").select(select).eq("id", workshopId).single()
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

export const insertWorkshopAccess = async ({ payload}: { payload: any }) => {
    return await supabase.from("workshop_access").insert(payload).select("*").single()

}

export const insertWritingWorkshop = async ({ payload }: { payload: any }) => {
     return await supabase.from("writing_workshops").insert(payload).select("*").single()
}