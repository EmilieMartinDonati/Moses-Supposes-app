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

import { fetchContributionsByWorkshop } from '@/actions/contributions';
import { fetchExquisiteCorpseCurrentParticipant } from '@/actions/exquisiteCorpses';
import { getWritingWorkshopById } from '@/services/supabase/writingWorkshops';

import { ContributionType } from '@/types/contributions';
import { ExquisiteCorpseParticipantType } from '@/types/exquisite_corpse_participants';
import { WritingWorkshopType } from '@/types/workshops';

import { submitContribution } from '@/actions/contributions';

export default function WritingWorkshopEditor() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const writingWorkshopId = id

  const guestId = useAppStore(state => state.guestId)
  const user = useAppStore(state => state.user)
  const userId = user?.id || null

  const [contributions, setContributions] = useState<ContributionType[] | []>([])
  const [writingWorkshop, setWritingWorkshop] = useState<WritingWorkshopType | null>(null)
  const [participant, setParticipant] = useState<ExquisiteCorpseParticipantType | null>(null)
  const [reloadContribution, setReloadContribution] = useState<boolean>(false)

  const fetchContributions = async () => {
    const retrievedContributions = await fetchContributionsByWorkshop({ workshopId: writingWorkshopId })
    setContributions(retrievedContributions)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchContributions()
      const refreshedWritingWorkshop = await getWritingWorkshopById(writingWorkshopId)
      setWritingWorkshop(refreshedWritingWorkshop)
    }
    fetchData()
    return () => {
      console.log("clear workshopid here")
    }
  }, [writingWorkshopId])

  useEffect(() => {
    const fetch = async () => {
      const foundParticipant = await fetchExquisiteCorpseCurrentParticipant({
        workshopId: writingWorkshopId, userId, guestId
      })
      setParticipant(foundParticipant)
    }
    fetch()
  }, [writingWorkshopId, guestId, userId])

  useEffect(() => {
    if (reloadContribution) {
      fetchContributions()
      setReloadContribution(false)
    }
  }, [reloadContribution])


  // call useEffect hook to register user presence in workshop with supabase realTime and to untrack user when component unmounts
  useWorkshopChannel({ writingWorkshopId, guestId, userId })

  const handleSubmitContribution = async (data: { text: string }) => {
    if (!writingWorkshop || !participant) {
      // error handling to do here
      return
    }
    await submitContribution({
      content: data.text,
      workshopId: writingWorkshopId,
      type: writingWorkshop.type,
      participantId: participant.id
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
        onSubmit={handleSubmitContribution} />
    </SafeAreaView>)

}

const styles = StyleSheet.create({
  writingWorkshopEditorContainer: {
    flex: 1,// why do I need to put it I don't see why view is not full screen by default ?
    justifyContent: 'space-between',
    backgroundColor: "white"
  }
});