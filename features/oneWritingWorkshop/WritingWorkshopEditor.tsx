import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppStore } from '@/store/useAppStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from "react";

import WritingWorkshopComposer from '@/features/oneWritingWorkshop/WritingWorkshopComposer';
import WritingWorkshopContent from '@/features/oneWritingWorkshop/WritingWorkshopContent';
import WritingWorkshopHeader from '@/features/oneWritingWorkshop/WritingWorkshopHeader';
import WritingWorkshopPrompt from '@/features/oneWritingWorkshop/WritingWorkshopPrompt';

import { fetchContributionsByWorkshop, submitContribution } from '@/actions/contributions';
import { fetchExquisiteCorpseCurrentParticipant } from '@/actions/exquisiteCorpses';

import { ContributionType } from '@/types/contributions';
import { ExquisiteCorpseParticipantType } from '@/types/exquisite_corpse_participants';
import { WritingWorkshopType } from '@/types/workshops';

import useExquisiteCorpseRealtime from '@/hooks/realTime/useExquisiteCorpseRealtime';
import useWorkshopPresenceChannel, { ChannelPresenceState } from '@/hooks/realTime/useWorkshopChannel';

import { fetchWritingWorkshopWithConfig } from '@/actions/writingWorkshops';
import { ExquisiteCorpseConfig } from '@/types/exquisite_corpse_config';

import { replayExquisiteCorpse } from '@/actions/exquisiteCorpses';
import { OnlineParticipant } from '@/types/workshops';


export default function WritingWorkshopEditor() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const writingWorkshopId = id

  const guestId = useAppStore(state => state.guestId)
  const user = useAppStore(state => state.user)
  const userId = user?.id || null

  const [contributions, setContributions] = useState<ContributionType[] | []>([])
  const [writingWorkshop, setWritingWorkshop] = useState<WritingWorkshopType & ExquisiteCorpseConfig | null>(null)

  const [prevParticipant, setPrevParticipant] = useState<ExquisiteCorpseParticipantType | null>(null)
  const [participant, setParticipant] = useState<ExquisiteCorpseParticipantType | null>(null)
  const [userContributionsCount, setUserContributionsCount] = useState(0)

  const [onlineParticipants, setOnlineParticipants] = useState<OnlineParticipant[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReplaySubmitting, setIsReplaySubmitting] = useState(false)

  const replayAllowed = useMemo(() => {
    if (!writingWorkshop) {
      return false
    }
    return writingWorkshop.visibility === "public" || userContributionsCount < (writingWorkshop.iterations_count || 1)
  }, [writingWorkshop, userContributionsCount])

  const fetchContributions = async () => {
    const retrievedContributions = await fetchContributionsByWorkshop({ workshopId: writingWorkshopId })
    setContributions(retrievedContributions)
  }

  const fetchWorkshop = async () => {
    const retrievedWritingWorkshop = await fetchWritingWorkshopWithConfig({ workshopId: writingWorkshopId })
    setWritingWorkshop(retrievedWritingWorkshop)
  }

  const fetchParticipant = async () => {
    const foundParticipant = await fetchExquisiteCorpseCurrentParticipant({
      workshopId: writingWorkshopId, userId, guestId
    })
    setParticipant(foundParticipant)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchContributions()
      await fetchWorkshop()
    }
    fetchData()
  }, [writingWorkshopId])

  useEffect(() => {
    // wait for an identity to resolve (guestId hydrates async from AsyncStorage)
    if (!userId && !guestId) {
      return
    }
    fetchParticipant()
  }, [writingWorkshopId, guestId, userId])

  // ------------------------------------------------------------------------------- //
  // ---------------------------- CHANNELS AND LISTENERS ---------------------------- //
  // ------------------------------------------------------------------------------- //
    const _handleNewContribution = (newContribution: ContributionType) => {
    const updatedContributions = [...contributions, newContribution]
    setContributions(updatedContributions)
    const userContributions = updatedContributions.filter((contribution) => {
      if (userId && contribution.user_id) {
        return contribution.user_id === userId
      }
      else if (guestId && contribution.guest_id) {
        return contribution.guest_id === guestId
      }
    })
    setUserContributionsCount(userContributions.length)
  }

  const _handleParticipantStateChange = (refreshedParticipant: ExquisiteCorpseParticipantType) => {
    setParticipant(refreshedParticipant)
  }

  const _handlePresenceChange = (presenceState: ChannelPresenceState) => {
    setOnlineParticipants(Object.values(presenceState).flat())
  }

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
    if (!writingWorkshop) {
      return
    }
    // lock button
    setIsReplaySubmitting(true)
    // create new ticket
    const newParticipant = await replayExquisiteCorpse({
      workshopId: writingWorkshop.id,
      userId,
      guestId
    })
    // refresh participant
    if (newParticipant) {
      // we keep prev participation to avoid user to be shown in onlineparticipants (normally, only others participants)
      setPrevParticipant(participant)
      setParticipant(newParticipant)
    }
    // unlock
    setIsReplaySubmitting(false)
  }


  if (!writingWorkshop || !participant) {
    return null // show loading screen here
  }

  return (
    <SafeAreaView style={styles.writingWorkshopEditorContainer}>
      <WritingWorkshopHeader
        title={writingWorkshop?.title}
        type={"Cadavre Exquis"}
        onlineParticipants={onlineParticipants.filter((p) => p.participant_id !== participant.id && p.participant_id !== prevParticipant?.id)}
      />
      <WritingWorkshopPrompt
        prompt={writingWorkshop?.prompt} />
      <WritingWorkshopContent
        contributions={contributions}
        showLastContribution={participant.state === "active"} />
      <WritingWorkshopComposer
        participant={participant}
        onlineParticipant={onlineParticipants.find((p) => p.participant_id === participant.id)}
        onSubmit={handleSubmitContribution}
        onReplay={handleReplay}
        isSubmitting={isSubmitting}
        replayAllowed={replayAllowed}
        isReplaySubmitting={isReplaySubmitting}
        rules={{
          maxSentences: writingWorkshop.max_sentences,
          writingDelay: writingWorkshop.writing_delay

        }}
      />
    </SafeAreaView>)

}

const styles = StyleSheet.create({
  writingWorkshopEditorContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: "white"
  }
});
