import { StateCreator } from "zustand"

type WorkshopType = {
    id: string,
    status: "draft" | "published",
}

// Data fields are left as `any` for now: the workshop screens still rely on the
// store being loosely typed (incomplete WorkshopType, string | string[] params).
// Typing these properly is follow-up work, separate from the auth/users slice.
export type WorkshopsSlice = {
    writingWorkshopId: any
    writingWorkshop: any
    setWritingWorkshopId: (writingWorkshopId: string) => void
    setWritingWorkshop: (writingWorkshop: WorkshopType) => void
    clearWritingWorkshop: () => void
}

export const createWritingWorkshopsSlice: StateCreator<any> = (set) => ({
    writingWorkshopId: null,
    writingWorkshop: null,
    setWritingWorkshopId: (writingWorkshopId: string): void => {
        set({ writingWorkshopId: writingWorkshopId })
    },
    setWritingWorkshop: (writingWorkshop: WorkshopType): void => {
        set({ writingWorkshop: writingWorkshop })
    },
    clearWritingWorkshop: () => {
        set({ writingWorkshopId: null, writingWorkshop: null })
    }
})