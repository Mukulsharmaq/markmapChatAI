# Shape Up — Complete Book Notes

**Ryan Singer, Basecamp** · Free web book: <https://basecamp.com/shapeup>

These notes cover the *entire* book — Foreword through Glossary. They continue the "Shape up (Basecamp)" section of the Must Read doc, which stopped at Chapter 1 with "Continue from here → chapter-02". Everything below is the rest of the book, consumed and distilled.

**The whole system in one line:** Shape the work before betting on it → bet six uninterrupted weeks with a capped downside → hand the whole project (not tasks) to a small team that discovers scopes, climbs the hill, and hammers scope to ship inside the box.

---

## Foreword (Jason Fried)

1. The *way* a team works — the how — is foundational. "Execution is everything" is often wrong: executing the wrong way destroys morale, erodes trust, burns people out.
2. Basecamp isn't waterfall, agile, or scrum. No sprints, no backlogs, no Kanban, no velocity tracking, no daily standups. A way of working developed in isolation over ~15 years of trial and error.
3. "Don't think of this as a book. Think of it as a flashlight."

## Chapter 1 — Introduction

*(Already summarized in the Must Read doc. Core: six-week cycles; shaping the work before betting; giving full responsibility to small integrated teams; targeting one risk everywhere — the risk of not shipping on time. Shaping reduces risk by removing rabbit holes; betting caps it with the circuit breaker; building reduces it by integrating one piece end-to-end early. Not a book about building the wrong thing — fix shipping first, discovery later.)*

---

# PART 1 — SHAPING

## Chapter 2 — Principles of Shaping

1. Shape at the **right level of abstraction: not too vague, not too concrete**.
    1. **Wireframes are too concrete** — no room for the designer's creativity; over-specifying makes estimation *harder* (hidden complexities behind "just so" interfaces); team can't reconsider costly decisions.
    2. **Words are too abstract** — "build a calendar view" gives no basis for trade-offs; "you have to be a mind reader"; under-specified projects grow without bound.
2. **Case study — the Dot Grid Calendar**: customers asked for "a calendar" (6+ months of work, past versions used by only ~10% of customers). Appetite: one 6-week cycle → build a tenth of what "calendar" means. Which tenth? A two-month **read-only dot grid** — dots on days with events, list of events below, click a day to scroll. No dragging, no spanning pills, no color coding — comfortable trade-offs because the use case was understood.
3. **Three properties of shaped work:**
    1. **It's rough** — everyone can see it's unfinished; leaves room for judgement and expertise.
    2. **It's solved** — the main elements are there at the macro level and connect together; open questions and rabbit holes removed.
    3. **It's bounded** — it says what *not* to do; a specific appetite forces things out.
4. **Who shapes**: generalists — combine interface ideas + technical possibilities + business priorities. Primarily design work (interaction design from the user's perspective), but requires technical literacy (judge what's possible in the appetite) and strategic thinking (what are we solving, why does it matter, what counts as success).
5. Shaping is a **closed-door, creative, private process** — rough diagrams nobody else could interpret; option to shelve work that isn't working out.
6. **Two tracks running in parallel**: shapers shape future cycles while teams build the current cycle. You can't schedule shaping — unshaped work is by nature risky and unknown.
7. **Four steps to shaping**: set boundaries → rough out the elements → address risks and rabbit holes → write the pitch.

## Chapter 3 — Set Boundaries

1. **Appetite = time budget for a standard team size.** Two sizes:
    1. **Small Batch** — 1 designer + 1–2 programmers, 1–2 weeks (batched together into a cycle).
    2. **Big Batch** — same team, the full six weeks.
2. **An appetite is completely different from an estimate.** "Estimates start with a design and end with a number. **Appetites start with a number and end with a design.**" The appetite is a creative constraint on the design process.
3. **Fixed time, variable scope** — the key principle for defining and shipping. Deadlines force trade-offs (fix typos vs. add a section). Applied at every stage.
4. **"Good" is relative** — no best solution in the absolute; only in context of time and importance. "The ultimate meal might be a ten course dinner. But when you're hungry and in a hurry, a hot dog is perfect."
5. **Responding to raw ideas**: default answer is *"Interesting. Maybe some day."* — a very soft "no" that leaves options open. Never yes/no on first contact; keep a poker face (enthusiasm sets expectations; dismissal shuts down learning).
6. **Narrow down the problem** — dig for what's *really* going wrong:
    1. Permission-rules request → real problem was an archive action with unclear impact → one-day warning instead of a six-week feature.
    2. **Case study — defining "calendar"**: asked the customer *when* she wanted it, not why/what. Story: chalkboard wall calendar at the office, working from home, drove through traffic to check free meeting slots. Insight: the need was **"see free spaces"**, not "do everything a calendar does" → led to the Dot Grid.
    3. If you can't pin a specific pain point and it's not critical — walk away; the appetite also caps how much research is worth.
7. **Watch out for grab-bags**: "redesign the Files section" / anything labeled "2.0" is not a project. Files 2.0 failed because nobody knew what "done" looked like; recovered by splitting into "Better file previews", "Custom folder colors", each with its own appetite.
8. Boundaries in place = raw idea + appetite + narrow problem definition.

## Chapter 4 — Find the Elements

1. Output of this step: **the elements of a solution** — moving from words to software concepts, fast and wide, without wireframes.
2. Two prerequisites for moving at the right speed: the right people (nobody, or one trusted partner who keeps pace) and the right level of detail.
3. Questions to answer: Where does it fit in the current system? How do you get to it? What are the key components/interactions? Where does it take you?
4. **Breadboarding** (from electrical engineering: all components and wiring, no industrial design). Three notation elements, all words, no pictures:
    1. **Places** — screens, dialogs, menus you can navigate to (underlined name).
    2. **Affordances** — buttons, fields, interface copy (listed under the place).
    3. **Connection lines** — how affordances take you from place to place.
    4. Autopay example: sketching flows (Invoice → Setup Autopay → Confirm) surfaced deep functional questions (does enabling Autopay also pay the current invoice?) and let the team flip cheaply between approaches (enable at "pay" time instead; skip username/password entirely — invoicer disables Autopay from the customer page).
5. **Fat marker sketches** — when the idea is inherently visual/2D. Strokes so broad that detail is *impossible*. (Sharpie on paper; iPad with large pen diameter.) To-Do Groups example: dividers create "loose" vs "grouped" to-dos.
6. **Elements are the output** — e.g. Dot Grid: 2-up monthly grid; dots not spanned pills; agenda list below that scrolls on tap. Extremely narrow and specific vs. "monthly calendar".
7. **Room for designers**: any concrete mockup from someone senior biases everything downstream — people take every detail as direction. Abstraction leaves creative space. "This isn't a spec. It's more like the boundaries and rules of a game."
8. **No conveyor belt** — at this stage you can still walk away; nothing is committed. You've only made the raw idea more actionable.

## Chapter 5 — Risks and Rabbit Holes

1. Goal: a **thin-tailed probability distribution** of shipping time. One unanticipated two-week problem burns a third of the budget; rabbit holes stretch the right tail to 3x+.
2. Slow down and stress-test the concept: walk through a use case **in slow motion**; question every part:
    1. New technical work we've never done?
    2. Assumptions about how parts fit together?
    3. Assuming a design solution exists that we couldn't come up with ourselves? *(They once bet on a home-screen redesign assuming "the designer will figure it out" — nobody could; project abandoned.)*
    4. A hard decision to settle in advance so it doesn't trip the team?
3. **Case study — patching a hole**: To-Do Groups didn't address completed items. Instead of pushing the tangled design problem to the team under deadline, shapers **dictated the compromise**: leave completed items exactly as they were, append the group name to each. "Thinking less about the ultimate design and more about basic quality and risk."
4. **Declare out of bounds**: group-notification idea → core value was narrowing who to notify on *messages*; to-dos/chat mentions explicitly out of bounds.
5. **Cut back**: color-coded groups flagged as unnecessary — nice-to-have, not core.
6. **Present to technical experts** (still private, friendly-conspiratorial: "Here's something I'm thinking about… not ready to show anybody yet").
    1. Never ask "Is this possible?" — "In software everything is possible but nothing is free." Ask **"Is this possible in six weeks?"**
    2. **Keep the clay wet** — redraw on a whiteboard from scratch rather than presenting a document; then invite revisions ("any way to drastically simplify?").
7. End state: elements + patches for rabbit holes + fences (out-of-bounds) → ready to write up.

## Chapter 6 — Write the Pitch

1. Purpose: present a good potential bet so people with less context can understand, digest, evaluate.
2. **Five ingredients, always:**
    1. **Problem** — raw idea/use case that motivates. *Never present a solution without a problem* — a single specific story showing why the status quo fails is the best problem definition; it gives a test of fitness (and separates "is the solution good" from "does the demand matter").
    2. **Appetite** — prevents unproductive "there's always a better version" conversations; "Anybody can suggest expensive and complicated solutions." Stating it makes everyone a partner in fitting the box.
    3. **Solution** — the shaped elements, presented so people can *see* it. "A problem without a solution is unshaped work" — betting on it pushes exploration to the wrong level.
    4. **Rabbit holes** — call out the patches so nobody trips later (sometimes just a line: "URLs won't live on custom domains in v1").
    5. **No-gos** — what we're deliberately not doing (e.g. no WYSIWYG editing on the payment form; logo + header text only).
3. **Help them see it** (fidelity techniques for pitches):
    1. **Embedded sketches** — fat-marker elements drawn on top of a real screenshot for the "linchpin" part everyone must get concretely; add a disclaimer about designer latitude.
    2. **Annotated fat marker sketches** — redrawn cleanly on iPad, second color for labels, numbered call-outs.
4. **Delivery**: asynchronous by default. Post the pitch where stakeholders read it on their own time (Basecamp: a "Pitch" message category in the Product Strategy team). Comments poke holes / add missing information — the yes/no happens at the betting table.

---

# PART 2 — BETTING

## Chapter 7 — Bets, Not Backlogs

1. **No backlogs.** Backlogs are a weight: hundreds of tasks nobody will do, constant grooming, guilt of "always behind". "Just because somebody thought some idea was important a quarter ago doesn't mean we need to keep looking at it again and again."
2. Instead: before each cycle, the betting table looks at **a few potential bets** — pitches from the last six weeks, or old pitches someone purposefully revived and lobbied for. Nothing else is on the table.
3. Bet → build next cycle. No bet → **let it go**. Nothing tracked centrally. An advocate tracks it their own way and lobbies again.
4. **Decentralized lists**: support tracks frequent requests, product tracks shaping ideas, programmers keep bug lists — none are direct inputs to betting. Cross-pollination via regular but infrequent one-on-ones.
5. **Important ideas come back.** "Ideas are cheap." If it matters, it returns — with context, carried by a person, timely. If you never hear it again, it wasn't a problem.

## Chapter 8 — The Betting Table

1. **Six-week cycles**: two-week sprints are too short to do anything meaningful and cost too much planning overhead ("Calendar Tetris", broken momentum). Six weeks = long enough to finish something meaningful, short enough to **feel the deadline from day one**.
2. **Cool-down = two weeks between cycles**: no scheduled work — breathe, meet, fix bugs, explore ideas, decide what's next. (End of a cycle is the worst time to plan.)
3. **Standardized team + project sizes**: 1 designer + 1–2 programmers (+ QA later). Big batch team = one 6-week project. Small batch team = several 1–2-week projects, self-juggled to all ship within the cycle.
4. **The betting table**: a cool-down meeting — CEO, CTO, senior programmer, product strategist. Pitches studied beforehand; call rarely over 1–2 hours; output = the **cycle plan**. Highest people in the company are present → no second step of approval, and nobody can interfere afterward.
5. **The meaning of a bet** (vs. "planning"):
    1. **Bets have a payout** — something meaningful *finished* at the end, not incremental progress filling a time box.
    2. **Bets are commitments** — the team gets the entire six weeks, uninterrupted.
    3. **Bets cap the downside** — the most you can lose is six weeks.
6. **Uninterrupted time**: "When you pull someone away for one day… you don't just lose a day. You lose the momentum they built up." "Losing the wrong hour can kill a day. Losing a day can kill a week." New urgent thing? It waits at most six weeks — which is why you only bet one cycle ahead. True crises (brake-pull) are very rare.
7. **The circuit breaker**: projects that don't ship in the cycle **don't get an extension by default**.
    1. Kills runaway projects (never spend 2–10x the appetite).
    2. Not finishing = something wrong in the *shaping* → reframe the problem, re-shape, re-pitch; don't pour more time on a bad approach.
    3. Motivates team ownership of trade-offs — a real deadline with real consequences.
8. **What about bugs?** Nothing about a bug automatically outranks planned work. All software has bugs. Crisis → drop everything (rare). Otherwise: (1) fix in **cool-down**, (2) shape it and bring it to the **betting table**, (3) annual **bug smash** cycle around the holidays.
9. **Keep the slate clean**: bet one cycle at a time; never auto-carry scraps of old work. Multi-cycle visions stay in your head — shape a specific six-week end state each time, keep the option to change course.

## Chapter 9 — Place Your Bets

1. Bet differently depending on **where you are**: existing product vs. new product.
2. **Existing products**: standard Shape Up — shape, bet, build, ship within the cycle. Like crafting furniture for a built house.
3. **New products — three phases** (still bet one cycle at a time):
    1. **R&D mode**: you can't shape reliably because you *learn what you want by building it*. Bets buy spikes, not shipping. Senior people (CEO/CTO-level) do the work themselves — you can't delegate what you can't define, and the architectural decisions define the product's future "holes". Goal: commit to load-bearing structure.
    2. **Production mode**: architecture settled → formal shape/bet/build cycles with more people. "Shipping" = merged to main and not touched again (product not public yet), so the final cut can still drop features.
    3. **Cleanup mode**: pre-launch free-for-all. No shaping, no team boundaries; leadership at the helm; ship continuously in small bites; make the final-cut decisions (smaller v1 surface = less to support and maintain forever). Discipline: max ~two cycles; watch for cold feet masquerading as must-haves.
    4. **HEY example**: ~1 year R&D (Jason, David, Jonas) → ~1 year production cycles → two cleanup cycles, big cuts, launched July 2020. Every bet placed one cycle at a time; returning to Basecamp was always on the table.
    5. **Hill Charts feature example** (grey area): experimental feature in an existing product framed like production mode — bet one cycle to build a version usable internally, then a second bet to round it out and ship.
4. **Questions at the betting table:**
    1. **Does the problem matter?** Problems weigh against each other; a sweeping solution can trigger re-examining the problem (80% benefit from 20% change?).
    2. **Is the appetite right?** "No" to the time is sometimes "no" to something else — ask "How would you feel if we could do it in two weeks?" to surface the real objection.
    3. **Is the solution attractive?** e.g. screen real estate is capital — are we selling the home-page corner too cheaply? (But: "we're not doing design here.")
    4. **Is this the right time?** Splash vs. fixes; team morale after repeated work in the same area.
    5. **Are the right people available?** Match expertise, appetite for big vs small batch, vacations. Teams are formed per-cycle from the Core Product pool.
5. **Post the kick-off message**: announce the cycle's bets and team assignments to everyone.

---

# PART 3 — BUILDING

## Chapter 10 — Hand Over Responsibility

1. **Assign projects, not tasks.** Splitting a project into tasks up front "is like putting the pitch through a paper shredder." The team defines its own tasks and approach — full autonomy inside the pitch's boundaries. "Talented people don't like being treated like code monkeys."
2. **Done means deployed** within the cycle — QA included. (Help docs, marketing announcements: thin-tailed risk, handled in cool-down.)
3. **Kick-off**: post the shaped concept, hold a call, answer questions.
4. **Getting oriented**: the first days look like nothing is happening — heads down learning the system, thinking through the pitch, dead ends. Managers must respect the silence; demanding visible progress just pushes legitimate exploration underground. Rule of thumb: step in if silence lasts past ~3 days.
5. **Imagined vs. discovered tasks**: the tasks you list at the start are imagined; the real bulk of the project is discovered by doing real work. "The way to really figure out what needs to be done is to start doing real work."

## Chapter 11 — Get One Piece Done

1. Aim for something **tangible and demoable within the first week** — integrate *vertically* (design + code on one small piece) instead of building horizontal layers that meet in the 11th hour. "Lots of things are done but nothing is really done."
2. **Case study — Clients in Projects**: three moving parts (client access model, client management, visibility toggle). Team integrated the **visibility toggle** first — most central UI. Designer experimented with affordances directly in HTML templates; programmer wired just enough (toggle renders, changes state, saves) without actual visibility logic. Demoed a working core interaction on day ~3.
3. **Programmers don't need to wait** — the pitch gives enough direction for foundational back-end decisions from day one.
4. **Affordances before pixel-perfect screens**: programmers only need endpoints — fields, buttons, where data appears. "First make it work, then make it beautiful." Raw unstyled HTML answers the big questions early: does it make sense? does it do what we want?
5. **Program just enough for the next step**: strategically patchy back-ends — controllers with mock data, routes between stubbed screens, HTTPAuth instead of real authentication. Create a back-and-forth between design and programming on the same piece, not one big hand-off.
6. **Start in the middle** — three criteria for the first piece:
    1. **Core** — without it the rest means nothing (visibility toggle, not "rename a client").
    2. **Small** — done end-to-end in a few days; momentum.
    3. **Novel** — prefer what you've never done before; it eliminates uncertainty.

## Chapter 12 — Map the Scopes

1. **Organize by structure, not by person.** Designer-list + programmer-list = tasks complete but nothing finished. Fundraiser example: lists per *part* (Food Menu, Venue Setup, Light/Sound), not per volunteer.
2. **Scopes** = integrated front-end + back-end slices of the project that can be **finished independently**, in a few days or less. Bigger than tasks, much smaller than the project. Tracked as to-do lists (one list per scope).
3. **Scopes become the language of the project**: "After Bucket Access we can implement Invite Clients." Status conversations happen at this level — pointing at finished pieces of software, not defending individual tasks.
4. **Case study — Message drafts**: start with one "Unscoped" list of discovered tasks → carve off "Start New" to get one piece done → factor the rest into Locate / Trash / Save-Edit → further split out Send, then Store and Reply. "Suddenly the team could see the whole project at the macro level."
5. **Scope mapping isn't planning — you walk the territory before you draw the map.** Scopes arise from real interdependencies discovered by doing work. Expect accurate scopes at end of week 1 / start of week 2, with early instability and redrawing.
6. **The scopes are right when** (project anatomy):
    1. You can see the whole and nothing worrying hides in the details.
    2. Conversations flow — the scopes give the right language.
    3. New tasks have an obvious bucket to land in.
7. **Redraw when**: hard to say how "done" a scope is (unrelated tasks inside); generic names like "front-end" or "bugs" ("grab bags and junk drawers"); too big to finish soon.
8. **Shapes of work**:
    1. **Layer cakes** — thin, even back-end under UI: judge by UI surface area; integrate design + code in one scope (default for information-system apps).
    2. **Icebergs** — back-end far bigger than UI (or upside-down: complex UI, simple model). Factor the UI (or halves of the back-end) into separate scopes; always challenge the complexity first: is it really necessary and irreducible?
    3. **Chowder** — a list for loose tasks that fit nowhere; if it exceeds 3–5 items, "something is fishy" — a scope is hiding.
9. **Mark nice-to-haves with `~`** — the constant sorting of must-have vs nice-to-have. "In a fixed time box, we need a machete in our hands."

## Chapter 13 — Show Progress

1. Managers hate asking for status; to-do lists can't answer it because **lists grow as the team makes progress** (discovered tasks) — outstanding-task counts mislead.
2. **Estimates don't show uncertainty** — "4 hours, or maybe 3 days" isn't an estimate. Shift focus from done/not-done to **unknown vs. solved**.
3. **Work is like a hill**:
    1. **Uphill** = figuring out what to do (uncertainty, unknowns, problem solving).
    2. **Top** = "Now I know what I have to do" — you can see all remaining steps (only now is estimating even fair).
    3. **Downhill** = execution: certainty, confidence.
    4. Dinner-party example: choosing cuisine (uphill) → recipe chosen + shopping list (top) → shopping, cooking, cleanup (downhill).
4. **Scopes on the hill**: plot each scope as a colored dot; scopes give the nouns, the hill gives the status.
5. **Status without asking**: self-serve hill chart updates; **comparing snapshots over time is the killer feature** — see what's moving and what's stuck; workshop the one stuck scope without untangling everything else.
6. **Nobody says "I don't know"** — a dot that doesn't move *is* the raised hand. The uphill/downhill language keeps it about the work, not the person: "What can we solve to get that over the hill?"
7. **Prompts to refactor scopes**: a stuck dot ("Notify") may really be three scopes moving at different speeds (Email / In-app Menu / Delivery) → split them so progress is visible and honest.
8. **Build your way uphill** — beware solving with your head instead of your hands. First third: "I've thought about this." Second: "I've validated my approach." Final: "far enough with what I've *built* that no other unknowns remain."
9. **Solve in the right sequence**: push the scariest, most novel work uphill **first**; leave routine screw-tightening for last. "Work expands to fill the time available" — there's a one-day version of the email template; the geocoder can surprise you for weeks. Like the journalist's **inverted pyramid**: essentials first, cuttable detail last. End of cycle should hold only nice-to-haves and maybes.

## Chapter 14 — Decide When to Stop

1. "Shipping on time means shipping something imperfect." The queasy question: is it good enough?
2. **Compare to baseline** — not up to the ideal, but **down to what customers have today**. "Better than what they have now" beats "never good enough". It's about value for the customer, not our pride.
3. **Limits motivate trade-offs**: the circuit breaker forces "is there time for this?" before "wouldn't it be better if…".
4. **Scope grows like grass** — scope creep is nobody's fault; it's the nature of work (projects are opaque at the macro scale). Don't try to stop growth; **give teams tools, authority, and responsibility to constantly cut it down**.
5. **Cutting scope isn't lowering quality** — being picky about scope *differentiates the product*. Variable scope ≠ sacrificing quality of code/design/copy/performance; it's choosing which things actually move the needle.
6. **Scope hammering** (stronger than "cutting") — the question battery:
    1. Is this a must-have for the new feature?
    2. Could we ship without this?
    3. What happens if we don't do this?
    4. Is this a new problem or a pre-existing one customers already live with?
    5. How likely is this case to occur?
    6. When it occurs, who sees it — everyone, or an edge case?
    7. What's the actual impact?
    8. How aligned is the affected use case with our intended audience?
    9. Must-haves block a scope's "done"; nice-to-haves get the `~` and usually never get built — *that's the hammering working*.
7. **QA is for the edges**: designers and programmers own basic quality (their own tests); one QA person hunts edge cases late in the cycle. QA is "a level-up, not a gate." QA findings default to nice-to-have; the team triages severity upward. Code review same spirit: no formal checkpoint; a teaching opportunity, not a gate.
8. **When to extend a project** (rare, couple weeks max):
    1. Outstanding tasks are true must-haves that survived every hammer blow, **and**
    2. All remaining work is **downhill**. Uphill unknowns at the deadline = a hole in the shaping → circuit-break it, re-shape, maybe re-bet later.
    3. Cool-down can absorb slight overruns — but as a habit it signals a shaping or performance problem.

## Chapter 15 — Move On

1. **Let the storm pass**: shipping generates work — requests, bugs, pushback ("You ruined it! Change it back!"). Stay cool for a few days; remember why you made the change and for whom.
2. **Stay debt-free**: committing to react to feedback = taking on debt against the next cycle's clean slate. Handle with a gentle "no" that keeps options open.
3. **Feedback needs to be shaped** — full circle: new requests are raw ideas → back to Set Boundaries. If truly important, make it the top priority on the *shaping track* next cycle and bring it to the betting table properly.

## Conclusion — Key Concepts to Take Home

1. Shaped vs. unshaped work
2. Appetites instead of estimates
3. Designing at the right level of abstraction
4. Concepting with breadboards and fat marker sketches
5. Bets with a capped downside (circuit breaker), honored with uninterrupted time
6. The right cycle length (six weeks)
7. Cool-down between cycles
8. Breaking projects into scopes
9. Uphill vs. downhill work; communicating about unknowns
10. Scope hammering: must-haves vs. nice-to-haves
11. Feedback loop: shapeup@basecamp.com

---

# APPENDICES

## A1 — How to Implement Shape Up in Basecamp

1. A **Team** ("Product Strategy") for shaping: small membership (shapers + betting table); pitches as Messages with a "Pitch" category; Campfire for coordination; betting table over video chat; bets announced company-wide in HQ.
2. A **Project per cycle project** ("Cycle 4: Autopay"): add the team, post the kick-off message with the shaped concept.
3. **To-Do List per scope**, tasks as items, discussion threads on items.
4. **Hill Chart per scope**: "Track this on the Hill Chart" on each list → drag dots from unknown → known → done; annotate updates; timestamped history.

## A2 — Adjust to Your Size

1. Separate **basic truths** (scale-independent) from **specific practices** (scale-dependent):
    1. Work must be shaped somewhere — by a separate shaper or your future self; if you don't make trade-offs up front, "the universe will force us to make trade-offs later in a mad rush."
    2. Whatever the time frame, be deliberate about bets and cap the downside.
    3. Unknowns exist whether you chart them or not — distinguish them and sequence accordingly.
2. **Small enough to wing it** (2–3 people): drop the structure — no fixed cycles, cool-downs, formal pitches, betting table. Same people alternate hats: set an appetite, shape, build, repeat. Bets can vary (two weeks here, three there).
3. **Big enough to specialize**: fluidity flips to liability; adopt cycles, cool-down, formal betting. Someone moves up from in-cycle building to out-of-cycle shaping. Basecamp (~50 people): SIP team (security/infra/perf), Ops, technical Support — all shield the Core Product designers+programmers from interruption.

## A3 — How to Begin to Shape Up

1. **Option A — one six-week experiment**: shape one comfortable project (be conservative), guarantee an uninterrupted team of 1 designer + 2 programmers, kick off with a proper pitch, let them discover their own tasks, push Get One Piece Done. Don't worry about scope mapping or hill charts yet — layer them in later. Use the win as credibility.
2. **Option B — start with shaping** when you don't control programmers' time: better-shaped work through the existing process opens doors.
3. **Option C — start with cycles**: kill the two-week planning overhead first; capacity invites better shaping.
4. **Fix shipping first** — "You can have the best customer insight in the world, but if you can't turn it into a project and ship, it won't matter." Discovery improvements come after the shipping muscle.
5. **Focus on the end result** — judge the macro outcome ("How will we feel if this ships after six weeks?"), not idle hours at the micro scale.

## Glossary (the language, in one place)

| Term | Meaning |
|---|---|
| **Appetite** | Time we *want* to spend, vs. an estimate |
| **Baseline** | What customers do today without the thing |
| **Bet** | Committing a team to a project for one cycle, uninterrupted, expected to finish |
| **Betting table** | Cool-down meeting where stakeholders choose the next cycle's bets |
| **Big batch / Small batch** | One 6-week project / a set of 1–2-week projects in one cycle |
| **Breadboard** | UI concept: affordances + connections, no visual styling |
| **Circuit breaker** | Projects that don't ship in a cycle are cancelled by default, not extended |
| **Cool-down** | Two unscheduled weeks between cycles |
| **Cycle** | Six weeks of uninterrupted team work on shaped projects |
| **De-risk** | Improve shipping odds via shaping and removing rabbit holes |
| **Imagined / Discovered tasks** | Assumed at kick-off vs. found by doing real work |
| **Uphill / Downhill** | Unknowns being solved vs. pure execution |
| **Fat marker sketch** | UI sketch too low-fidelity to hold detail |
| **Hill chart** | Status from unknown → known → done |
| **Layer cake / Iceberg** | Even thin back-end under UI / one side far heavier |
| **Chowder** | Loose-task list; suspicious past 3–5 items |
| **Must-haves / Nice-to-haves (`~`)** | Block "done" / cut if time runs out |
| **Pitch** | Document presenting a shaped project for betting |
| **R&D / Production / Cleanup mode** | New-product phases: spike core with seniors / standard cycles, ship = merge / pre-launch free-for-all |
| **Rabbit hole** | Part too unknown, complex, or open-ended to bet on |
| **Raw idea** | Unshaped request in words |
| **Scope (n.) / Scope hammering (v.)** | Independently finishable slice / forcefully cutting to fit the box |
| **Shape** | Make an idea concrete enough to bet on, abstract enough to leave room |
| **Six weeks / Time horizon** | Longest period a deadline is felt from day one |

## About the Author

Ryan Singer — 17+ years at Basecamp across UI design, back-end programming, and strategy; now product strategy. Contact: shapeup@basecamp.com.

---

*Notes prepared from the full text at basecamp.com/shapeup (Foreword, Chapters 1–15, Conclusion, Appendices 1–3, Glossary, About the Author).*
