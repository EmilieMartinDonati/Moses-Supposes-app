import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppStore } from '@/store/useAppStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";

import WritingWorkshopComposer from '@/features/oneWritingWorkshop/WritingWorkshopComposer';
import WritingWorkshopContent from '@/features/oneWritingWorkshop/WritingWorkshopContent';
import WritingWorkshopHeader from '@/features/oneWritingWorkshop/WritingWorkshopHeader';
import WritingWorkshopPrompt from '@/features/oneWritingWorkshop/WritingWorkshopPrompt';

import { fetchContributionsByWorkshop, submitContribution } from '@/actions/contributions';
import { fetchExquisiteCorpseCurrentParticipant } from '@/actions/exquisiteCorpses';
import { getWritingWorkshopById } from '@/services/supabase/writingWorkshops';

import { ContributionType } from '@/types/contributions';
import { ExquisiteCorpseParticipantType } from '@/types/exquisite_corpse_participants';
import { WritingWorkshopType } from '@/types/workshops';

import useExquisiteCorpseRealtime from '@/hooks/realTime/useExquisiteCorpseRealtime';
import useWorkshopPresenceChannel, { ChannelPresenceState } from '@/hooks/realTime/useWorkshopChannel';

export type OnlineParticipant = {
  participant_id: string,
  joined_at: string,
  avatar_seed: string | null,
  display_name: string | null,
  workshop_id: string,
  presence_ref: string
}

export default function WritingWorkshopEditor() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const writingWorkshopId = id

  const guestId = useAppStore(state => state.guestId)
  const user = useAppStore(state => state.user)
  const userId = user?.id || null

  const [contributions, setContributions] = useState<ContributionType[] | []>([])
  const [writingWorkshop, setWritingWorkshop] = useState<WritingWorkshopType | null>(null)
  const [participant, setParticipant] = useState<ExquisiteCorpseParticipantType | null>(null)

  const [onlineParticipants, setOnlineParticipants] = useState<OnlineParticipant[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReplaySubmitting, setIsReplaySubmitting] = useState(false)

  const fetchContributions = async () => {
    const retrievedContributions = await fetchContributionsByWorkshop({ workshopId: writingWorkshopId })
    setContributions(retrievedContributions)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchContributions()
      const retrievedWritingWorkshop = await getWritingWorkshopById(writingWorkshopId)
      setWritingWorkshop(retrievedWritingWorkshop)
    }
    fetchData()
  }, [writingWorkshopId])

  useEffect(() => {
    // wait for an identity to resolve (guestId hydrates async from AsyncStorage)
    if (!userId && !guestId) return
    const fetch = async () => {
      const foundParticipant = await fetchExquisiteCorpseCurrentParticipant({
        workshopId: writingWorkshopId, userId, guestId
      })
      setParticipant(foundParticipant)
    }
    fetch()
  }, [writingWorkshopId, guestId, userId])

  const _handleNewContribution = (newContribution: ContributionType) => {
    setContributions(prev => [...prev, newContribution])
  }

  const _handleParticipantStateChange = (refreshedParticipant: ExquisiteCorpseParticipantType) => {
    setParticipant(refreshedParticipant)
  }

  const _handlePresenceChange = (presenceState: ChannelPresenceState) => {
    setOnlineParticipants(Object.values(presenceState).flat())
  }

  console.log("onlineParticipants", onlineParticipants)

  console.log("participant", participant)

  // ------------------------------------------------------------------------------- //
  // --------------------------------- CHANNELS ------------------------------------ //
  // ------------------------------------------------------------------------------- //
  useWorkshopPresenceChannel({
    workshopId: writingWorkshopId,
    participantId: participant?.id || null,
    guestId,
    onSyncChange: _handlePresenceChange
  })

  useExquisiteCorpseRealtime({
    workshopId: writingWorkshopId,
    participantId: participant?.id || null,
    onNewContribution: _handleNewContribution,
    onExquisiteCorpseParticipantStateChange: _handleParticipantStateChange
  })

  // ------------------------------------------------------------------------------- //
  // --------------------------------- USER ACTIONS--------------------------------- //
  // ------------------------------------------------------------------------------- //

  const handleSubmitContribution = async (data: { text: string }) => {
    if (!writingWorkshop || !participant) {
      // error handling to do here
      return
    }
    setIsSubmitting(true)
    await submitContribution({
      content: data.text,
      workshopId: writingWorkshopId,
      type: writingWorkshop.type,
      participantId: participant.id
    })
    setIsSubmitting(false)
  }

  const handleReplay = async () => {
    setIsReplaySubmitting(true)
    console.log("todo replay")
    // todo create new ticket
    // set participant to new ticket
    return
  }

  return (
    <SafeAreaView style={styles.writingWorkshopEditorContainer}>
      <WritingWorkshopHeader
        title={writingWorkshop?.title}
        type={"Cadavre Exquis"}
        onlineParticipants={onlineParticipants.filter((p) => p.participant_id !== participant?.id)}
      />
      <WritingWorkshopPrompt
        prompt={writingWorkshop?.prompt} />
      <WritingWorkshopContent
        contributions={contributions} />
      <WritingWorkshopComposer
        participant={participant}
        onlineParticipant={onlineParticipants.find((p) => p.participant_id === participant?.id)}
        onSubmit={handleSubmitContribution}
        onReplay={handleReplay}
        isSubmitting={isSubmitting}
        replayAllowed={true}
        isReplaySubmitting={isReplaySubmitting}
      />
    </SafeAreaView>)

}

const styles = StyleSheet.create({
  writingWorkshopEditorContainer: {
    flex: 1,// why do I need to put it I don't see why view is not full screen by default ?
    justifyContent: 'space-between',
    backgroundColor: "white"
  }
});