import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import WritingWorkshopConsultation from '@/features/oneWritingWorkshop/WritingWorkshopConsultation';
import WritingWorkshopEditor from '@/features/oneWritingWorkshop/WritingWorkshopEditor';

import { fetchWritingWorkshop } from '@/actions/writingWorkshops';
import { WritingWorkshopType } from '@/types/workshops';

export default function WorkshopRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const writingWorkshopId = id

  const [writingWorkshop, setWritingWorkshop] = useState<WritingWorkshopType | null>(null)

  useEffect(() => {
    if (!writingWorkshopId) {
      return
    }
    const fetchWorkshop = async () => {
      const retrievedWorkshop = await fetchWritingWorkshop({ workshopId: writingWorkshopId })
      setWritingWorkshop(retrievedWorkshop)
    }
    fetchWorkshop()
  }, [writingWorkshopId])

  if (!writingWorkshop) {
    return null // show loading screen here
  }

  const isDone = writingWorkshop.status === "closed" // todo from status

  return isDone ? <WritingWorkshopConsultation /> : <WritingWorkshopEditor />
}
