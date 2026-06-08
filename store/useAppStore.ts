import { create } from 'zustand'
import { createUsersSlice, UsersSlice } from './slices/users'
import { createWritingWorkshopsSlice, WorkshopsSlice } from './slices/workshops'

export type AppStore = UsersSlice & WorkshopsSlice

export const useAppStore = create<AppStore>()((...args) => ({
    ...createUsersSlice(...args),
    ...createWritingWorkshopsSlice(...args)
}))