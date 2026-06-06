# Product specs for Moses Supposes (mobile app)

## Overview

Moses Supposes is a collaborative writing app whose first purpose is to allow users to create exquisite cadavers and to participate in them along with their friends (in the case of private sessions) or with other internauts (in the case of public sessions). The exquisite cadavers may be prose or verse and may contain optional writing rules.

---

## Session types

### Private sessions

We have chosen a light authentication process to stay coherent with the playful and light purpose of the game: unlogged users are allowed to create private sessions, they are granted an access code that they can share on WhatsApp or by email with their friends. However, upon creating the game, they are asked to provide their email so that we can send them the entire story once the session is closed. This email will furthermore invite them to create an account so that they can have access to other features, most noticeably the possibility to create a public session.

**Turn structure:** Late joiners are welcome and the turn count stays dynamic — we do not lock the number of participants at session start.

**Result visibility:** The final story is sent by email to the creator. It is not publicly accessible.

### Public sessions

Only logged users are allowed to create public sessions. Those sessions have a defined start and end time. Players may play as many times as they like provided there are no other users waiting in the session. If several users are queueing, turns are handled depending on the time they joined.

**Result visibility:** The entire assembled story is permanently accessible on the landing page to all visitors, whether logged in or not. Past public sessions are browsable in a public gallery (`/explore`), with each story showing a teaser, the number of players, the date, and optional per-segment attribution (who wrote which part). This gallery is the main organic acquisition surface.

---

## Closing a session

### Private sessions

We want to avoid closing the session too soon (e.g. if the story doesn't feel complete or if a late newcomer joins).

**Normal close:** The session closes automatically once all participants have left. A short grace period (~1 minute) is applied before actually closing, to handle accidental tab closes and reconnections.

**Idle fallback:** If there are contributions but no one has contributed for the last hour (e.g. a user forgot to close their tab), the session is closed automatically regardless of presence state.


Upon closing, the final story is sent by email to the creator.

### Public sessions

The session closes once its defined end time is reached. A reminder email is sent to the creator 30 minutes before closing, with a link to extend if needed.

Upon closing, the final story is published to the public gallery and a summary email, with an access mail, is sent to the creator.

---

## Handling turns

These rules apply to both session types but are especially important for public sessions.

- **Idle player:** If the current player has not begun typing within 120 seconds, they are moved to the end of the waiting queue.
- **WhatsApp notification:** Upon joining a busy public session, if many players are waiting, the user is notified on WhatsApp when it is their turn so they do not have to stay in the app.

---

## AI-assisted session creation

The session creator may optionally use AI to generate:
- A writing prompt (in case inspiration fails them)
- Automatic writing rules (e.g. verse only, no adjectives, etc.)

---

## Open questions

- **Per-segment attribution in public stories:** Should the final public story show which player wrote each segment? Fitting for the exquisite cadaver format but requires collecting a display name at join time.
- **Extend end time:** Should the creator of a public session be able to extend the end time, and if so, by how much?

---

## Scope V2

Foreseen evolutions include:
- Generating writing workshops for students
- Generating writing contests
