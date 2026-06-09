import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useWorkshopChannel from '@/hooks/realTime/useWorkshopChannel';
import { useAppStore } from '@/store/useAppStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";

import WritingWorkshopComposer from '@/features/oneWritingWorkshop/WritingWorkshopComposer';
import WritingWorkshopContent from '@/features/oneWritingWorkshop/WritingWorkshopContent';
import WritingWorkshopHeader from '@/features/oneWritingWorkshop/WritingWorkshopHeader';
import WritingWorkshopPrompt from '@/features/oneWritingWorkshop/WritingWorkshopPrompt';

import { createSegment, fetchSegmentsByWorkshopId } from '@/services/supabase/segments';
import { getWritingWorkshopById } from '@/services/supabase/writingWorkshops';
import { SegmentType } from '@/types/segments';

export default function WritingWorkshopEditor() {

  const writingWorkshopIdFromStore = useAppStore(state => state.writingWorkshopId)
  const { id } = useLocalSearchParams()
  const writingWorkshopId = writingWorkshopIdFromStore || id
  const writingWorkshopFromStore = useAppStore(state => state.writingWorkshop)

  const guestId = useAppStore(state => state.guestId)
  const userId = useAppStore(state => state.userId)

  const [contributions, setContributions] = useState<SegmentType[]>([])
  const [writingWorkshop, setWritingWorkshop] = useState(writingWorkshopFromStore || null)
  const [reloadContribution, setReloadContribution] = useState<boolean>(false)

  const fetchContributions = async () => {
    const segments = (await fetchSegmentsByWorkshopId({ writingWorkshopId })) || []
    setContributions(segments)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchContributions()
      if (!writingWorkshop || writingWorkshop.id !== writingWorkshopId) {
        const refreshedWritingWorkshop = await getWritingWorkshopById(writingWorkshopId)
        setWritingWorkshop(refreshedWritingWorkshop)
      }
    }
    fetchData()
    return () => {
      console.log("clear workshopid here")
    }
  }, [writingWorkshopId])

  useEffect(() => {
    if (reloadContribution) {
      fetchContributions()
      setReloadContribution(false)
    }
  }, [reloadContribution])


  // call useEffect hook to register user presence in workshop with supabase realTime and to untrack user when component unmounts
  useWorkshopChannel({ writingWorkshopId, guestId, userId })

  const handleSubmitSegment = async (data: { text: string }) => {
    await createSegment({
      writingWorkshopId,
      guestId,
      userId,
      text: data.text
    })
    setReloadContribution(true)
  }

  return (
    <SafeAreaView style={styles.writingWorkshopEditorContainer}>
      <WritingWorkshopHeader
        title={writingWorkshop?.title}
        type={"Cadavre Exquis"}
        presencesCount={10}
        participantsCount={3}
      />
      <WritingWorkshopPrompt
        prompt={writingWorkshop?.prompt} />
      <WritingWorkshopContent
        contributions={contributions} />
      <WritingWorkshopComposer
        onSubmit={handleSubmitSegment} />
    </SafeAreaView>)

}

const styles = StyleSheet.create({
  writingWorkshopEditorContainer: {
    flex: 1,// why do I need to put it I don't see why view is not full screen by default ?
    justifyContent: 'space-between',
    backgroundColor: "white"
  }
});