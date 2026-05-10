# How to edit the Renoverse website

A guide for the Renoverse founder (and anyone else non-technical on the team) who wants to edit website copy, swap images, or push small updates without waiting on a developer.

You'll use two tools:

- **Claude Desktop** — the Claude app for your computer, in **Cowork** mode. Cowork is the part of Claude Desktop where Claude can read, edit, and run things in a folder on your machine — not just chat about them.
- **GitHub** — the place online where the website's files live and where the live site is published from.

Once you finish the one-time setup, every future edit is a short conversation: *"Change the homepage subhead to '…'. Preview it. If it looks good, push it live."* Claude does the file edit, the preview, and the publish.

If a step doesn't match what you're seeing on screen, stop and ask Claude what's going on in the same chat — *"I'm following the HANDOFF.md guide and step X says [Y], but my screen shows [Z]. What should I do?"* Don't guess and don't click anything you're unsure about.

---

## What this doc covers

- **Yes — covered here:** first-time setup, your first edit end-to-end, the recipe for any future edit, when to ask a developer.
- **For the sitemap of where every piece of copy lives** (e.g. *"which file holds the homepage hero text?"*) → [`EDITING.md`](./EDITING.md). You'll point Claude at it once the basics are set up.

---

## Before you start — prerequisites

You only do this once, in order:

1. **Paid Claude subscription.** Cowork is only available on paid plans (Pro, Max, Team, or Enterprise). The free tier won't work. **Pro is the minimum that includes Cowork** — start there; you can upgrade later if you hit usage limits.
2. **GitHub account.** If you don't already have one, create one at [github.com/signup](https://github.com/signup) — free, takes two minutes.
3. **Repo access.** Make sure your GitHub account has **write** access to the `renoverse-ai-website` repository. To check: log into [github.com](https://github.com), open the repo, and click any file. If you see a pencil icon (✏️) in the top right of the file view, you have write access. If you don't, contact whoever owns the company GitHub account to add you as a collaborator with the `Write` role.
4. **A Mac or Windows computer.** Cowork only runs on the desktop app — not the web app, not the iPhone app.

> *Screenshot placeholder: GitHub invitation email → "Accept invitation" page*

You only do all of this once. Once you have access, you can keep editing forever.

---

## Step 1 — Install Claude Desktop

Go to [claude.com/download](https://claude.com/download) and install the app for your computer.

Sign in with the same Anthropic account you use for [claude.ai](https://claude.ai) in the browser, on the paid plan from step 0 above.

> *Optional sanity check:* Anthropic provides a small program that confirms your computer can run Cowork. If you want to verify before going further, see the *"Will my computer support Cowork?"* section of [Anthropic's Cowork help article](https://support.claude.com/en/articles/12012173-get-started-with-claude-cowork). It takes 30 seconds.

> *Screenshot placeholder: claude.com/download page*
> *Screenshot placeholder: Claude Desktop home, signed in*

---

## Step 2 — Open Cowork and create a project

In the Claude Desktop sidebar, click **Cowork**. This switches Claude into Tasks mode — the mode where it can actually work with your files instead of just chatting.

Click **Projects**, then click **New project** in the top right.

> *Screenshot placeholder: Claude Desktop sidebar with "Cowork" highlighted*
> *Screenshot placeholder: Cowork → Projects view, empty state, "New project" button visible*

---

## Step 3 — Connect the project to a folder on your computer

Cowork will ask you to pick a folder. This is where your local copy of the website will live.

1. On your Desktop, create a new empty folder called `renoverse-website`.
2. In the Cowork dialog, select that folder.

> *Screenshot placeholder: folder picker dialog with `renoverse-website` selected*
> *Screenshot placeholder: Cowork showing the project linked to the empty folder*

---

## Step 4 — Set up the project's safety rails

This is the most important one-time step. We're going to give Cowork a set of standing instructions for this project so Claude follows them automatically every session — you don't have to remember to repeat them.

Inside the project, find **Folder instructions** (sometimes called *Project instructions* or *Edit instructions* depending on the app version). Click **Edit**, then paste the block below exactly:

```
This project is the Renoverse marketing website (a static HTML/CSS/JS site).
The user is non-technical and is editing copy, swapping images, or making other
small content changes. Always behave as follows:

1. Before changing any file, tell me in plain English exactly what you're about
   to change and which file. Wait for my "go ahead" before editing.

2. After editing, restart or confirm the local preview server at
   localhost:8000 (`python3 -m http.server 8000` from the project root) so I
   can verify in my browser before committing.

3. Never commit or push without my explicit "commit and push" instruction in
   the chat. Even if the change looks finished, do not commit on your own.

4. Never run `git push --force`, `git reset --hard`, `git checkout --`, or any
   command that deletes branches. If you think one is necessary, stop and
   explain why in plain English; we'll find a safer alternative together or
   leave the change unpushed.

5. Only edit files I named or files clearly required to make my requested
   change work. Don't refactor, reformat, or "clean up" anything I didn't ask
   about.

6. When unsure whether a request is a content edit or a structural change,
   ask me before doing anything. Default to caution. Refer to HANDOFF.md
   "When to bring in a developer" and EDITING.md "When to ask a developer"
   if those files exist in this folder — for structural changes, we hire a
   freelance developer instead of attempting them here.

7. Use plain-English commit messages. Format: `<area>: <what changed>` —
   for example, `homepage: update hero subhead`.
```

Click **Save**.

Now switch the project's permission mode to **Ask before acting** (look for a mode selector near the chat input — *Ask before acting* vs *Act without asking*). This makes Claude pause and wait for your "yes" before each shell command or file change. Slower than autopilot, but it's the right setting while you're learning the loop.

> *Screenshot placeholder: Settings → Cowork → Folder instructions edit dialog with the block pasted in*
> *Screenshot placeholder: Permission mode selector set to "Ask before acting"*

---

## Step 5 — Tell Claude to install the tools and download the website

Open a new task in this project. Paste this prompt exactly:

> *"I'm a non-technical user setting up to edit a website for the first time. Please:*
>
> *1. Make sure `git` and the GitHub CLI (`gh`) are available in this project's environment. Install whatever's missing.*
> *2. Clone `https://github.com/jannar18/renoverse-ai-website` into the current project folder.*
> *3. Walk me through `gh auth login` so I can authenticate with my GitHub account.*
> *4. After cloning, start a local preview server with `python3 -m http.server 8000` so I can view the site at localhost:8000.*
>
> *Tell me clearly when each step is done before moving on. Ask my approval before each command."*

> **Note on the URL:** the example above (`jannar18/renoverse-ai-website`) is the current location. If the repo has been moved to the company GitHub account, the URL will be different. Always copy the actual URL from the repo's GitHub page — click the green **Code** button at the top of the repo, copy the **HTTPS** address, and paste that into the prompt instead.

Claude will run terminal commands for you in its workspace. When it asks *"may I run this?"* and the command looks reasonable (something like `gh auth login` or `git clone …`), say yes. When `gh auth login` opens a browser tab, sign in to GitHub there.

**This step takes 5–10 minutes. You only do it once.** Future sessions skip straight to Step 6.

> *Screenshot placeholder: Claude asking permission to run an install command*
> *Screenshot placeholder: gh auth login browser confirmation page*
> *Screenshot placeholder: Claude reporting "clone complete"*
> *Screenshot placeholder: localhost:8000 in a browser, showing the Renoverse homepage*

---

## Step 6 — Make your first edit (a safe test edit)

Still in the same Cowork project. Paste this prompt:

> *"Change the homepage hero subhead in `index.html` to: 'Test edit — please ignore.' Don't commit yet. Tell me when I can refresh localhost:8000 to verify."*

Open `localhost:8000` in your browser and hard-refresh:

- **Mac:** Cmd-Shift-R
- **Windows:** Ctrl-Shift-R

You should see your test text where the subhead used to be.

> *Screenshot placeholder: localhost:8000 with "Test edit — please ignore." visible*

---

## Step 7 — Push the test edit live

If the preview looks right, paste:

> *"Looks good. Commit with the message `test: hero subhead` and push to main."*

Wait about 60 seconds, then visit the live site at [https://jannar18.github.io/renoverse-ai-website/](https://jannar18.github.io/renoverse-ai-website/) and hard-refresh. You should see your test edit there too.

> *Screenshot placeholder: live site showing the test edit*

---

## Step 8 — Revert the test

Now undo it the same way:

> *"Revert that test edit and push the original subhead back to main."*

Wait 60 seconds, refresh the live site, confirm the real subhead is back.

**You just did the entire edit-preview-push loop.** Every future edit follows the same shape.

---

## The recipe for any future edit

Three sentences:

1. **Tell Claude what to change in plain English.** Be specific — name the page, the section, and the new text. Example: *"On the homepage, change the testimonial quote to '…' and update the role under the name to 'Principal Architect'."*
2. **Preview locally first.** Open `localhost:8000` and hard-refresh. If localhost:8000 isn't running, just ask Claude: *"Run `python3 -m http.server 8000` and tell me when it's ready."*
3. **Say "commit and push" only when the preview looks right.** Then check the live site after 60 seconds.

Because the safety rails from Step 4 are baked into the project, you don't have to repeat *"don't commit without my approval"* or *"show me the change first"* every time — Claude already knows.

When you don't know which file holds the copy you want to change, see [`EDITING.md`](./EDITING.md) — it lists every page and every section with the file pointer. Or just ask Claude: *"Where does the homepage testimonial copy live in this repo?"*

---

## Useful phrases worth knowing

You don't need to memorize a long list — the safety rails from Step 4 do most of the work. But these four come up regularly:

- *"What did you just commit?"* — if you ever lose track of what's been pushed, ask. Claude will summarize the last commit.
- *"Run `python3 -m http.server 8000` and tell me when it's ready."* — restart the local preview when it stops.
- *"Pull the latest from main first, then [your edit]."* — use this whenever you sit down to edit; it makes sure your local copy is up to date in case anyone else has pushed since.
- *"Is this a content edit I can do, or do I need a developer?"* — paste this when unsure whether your change is in scope.

**Two things to never do, even if Claude suggests it:**

- Run anything that mentions **`force push`** or **`reset --hard`**. These can erase work permanently.
- Delete branches you didn't create yourself.

The Step 4 instructions tell Claude not to do these on its own — but if you ever see a suggestion like *"I'll force-push to clean things up,"* say **no**, then ask Claude: *"Explain why you wanted to do that, and what's the safe alternative?"* If you can't reach a safe alternative together, leave the change unpushed and come back to it later — nothing is on fire.

---

## When to bring in a developer

The recipe above covers copy edits, image swaps, and small content changes — these are safe to do yourself. **The following changes need a real web developer.** Don't try them through Cowork; the site is built so structural changes can have ripple effects across pages.

- New pages (e.g. a `pricing.html` page)
- New sections that don't exist on the site yet
- Removing or reordering existing sections
- Changing colors, fonts, spacing, or layout
- Connecting a form to a different backend (the demo and newsletter forms post to HubSpot today)
- Setting up A/B tests
- Adding or changing analytics
- Anything where Claude's response talks about "components", "tokens", or "shared CSS"

**How to find a developer when you need one:** hire a freelance front-end web developer through Upwork, Toptal, or your network. Give them this repository (point them at `README.md`, `AGENTS.md`, and `DESIGN.md` — those three docs explain the whole project to a developer in about 15 minutes). A small, well-scoped change should take 1–4 hours of paid work.

If unsure whether your change needs a developer, paste your request to Claude in the same Cowork project: *"Is this a content edit I can do safely, or do I need to hire a developer?"* Claude will tell you.

---

## Working with Cowork — practical notes

A few things worth knowing about how Cowork itself behaves, so the surprises don't surprise you:

- **Keep Claude Desktop open while it's working.** If you close the app or your computer goes to sleep mid-task, the task stops. For a quick copy edit this isn't an issue (a few seconds), but if you ask Claude to do something larger, leave the app open and the screen on until it reports done.
- **Cowork uses more of your monthly Claude usage than chat.** Don't worry about it for normal edits — just know that if you hit a usage cap, that's why. Save big multi-step asks for when you actually need them.
- **Files Claude edits are real.** They go straight to your folder, no "save" button. The safety rails from Step 4 keep this in check by requiring your approval before each change, but the change is still real once you say yes — it's why we always preview locally before committing.
- **Don't share Cowork tasks containing private info.** This site is public, so that's fine here, but as a habit don't paste API keys, customer data, or anything sensitive into Cowork.

---

## Troubleshooting

**"Claude is asking me to confirm a command and I don't know what it does."**
Paste back: *"Explain what this command does in plain English, and tell me whether it's safe to run."* Don't say yes until you understand.

**"localhost:8000 doesn't load — 'site can't be reached'."**
The preview server stopped running, or it never started in this session. Ask Claude: *"Run `python3 -m http.server 8000` again and tell me when it's ready."* If that still doesn't work, ask Claude: *"localhost:8000 isn't loading from my browser even though you say the server is running. Diagnose what's wrong, in plain English."* As a fallback, you can always push your change to the live site to see it — the safety rails make this safe.

**"I see my old version at localhost:8000, not the new edit."**
Hard-refresh (Cmd-Shift-R / Ctrl-Shift-R) — the browser is showing a cached copy. If that doesn't fix it, ask Claude: *"Did the edit save? Show me the current contents of [filename]."*

**"I pushed something I didn't mean to push."**
Don't panic. Ask Claude: *"I didn't mean to push that last commit. Please revert it on top of main and push the revert."* As long as you don't force-push, the previous version is recoverable.

**"Claude says it 'doesn't have access to that file'."**
The file may be outside the connected project folder. Confirm with Claude: *"What folder is connected to this Cowork project?"* and make sure the file you want to edit is inside it.

**"The recipe says click X but I don't see X on my screen."**
Don't guess. Ask Claude in your Cowork chat: *"I'm following HANDOFF.md and step X says to click [Y], but my Claude Desktop shows [what you see]. What's the equivalent in the current version?"* Claude Desktop's UI changes occasionally; the underlying functions stay the same.

---

## Glossary

- **Repository (repo)** — the folder of website files. Lives on GitHub online and on your computer locally; the two stay in sync via push and pull.
- **Commit** — a saved snapshot of one change, with a label (e.g. *"update homepage subhead"*). You can have many commits in a session.
- **Push** — uploads your committed changes from your computer to GitHub. Once pushed, the live site updates automatically within ~60 seconds.
- **Preview / localhost** — your computer's private copy of the site at `localhost:8000`. Anything here is invisible to the public until you push.
- **Cowork** — the mode in Claude Desktop where Claude can read, edit, and run things in a folder on your computer. Without Cowork, Claude can only chat about files.
- **Folder instructions** — standing instructions you give Claude for a specific Cowork project. Claude reads them every session, so you don't have to repeat the rules each time.
- **Permission mode** — whether Claude pauses for your approval before each action (*Ask before acting*) or runs straight through (*Act without asking*). Keep yours on *Ask before acting* for now.
- **Component** — a reusable piece of the site (the nav bar, the footer, a card grid). When copy lives in a component, it's in a `.js` file, not an `.html` file. [`EDITING.md`](./EDITING.md) tells you which is which.
- **Branch** — a parallel version of the website's files. We work directly on the main branch (called `main`), so you don't usually need to think about branches.
- **Main** — the live version of the website. Whatever is on `main` in GitHub is what the public sees.
