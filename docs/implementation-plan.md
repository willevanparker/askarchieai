## 🏗️ Step-by-Step Build Sequence

### Phase 1 — MVP Launch
1. **Set up project repo** (Vite + React + TypeScript)
2. **Install Tailwind CSS** with `shadcn/ui` component setup
3. **Design homepage layout** with:
   - Header + logo + primary CTA
   - Bold text: “Car question? Ask Archie!”
   - Split-color “A” and “i” using Tailwind utilities
   - Short explainer block
   - Full-page embedded ChatBase iframe
4. **Train ChatBase agent** using:
   - Uploaded PDFs (warranty docs, service guides)
   - CSVs (state fees, dealership charges)
   - URLs and screenshots
5. **Build "Chat With Archie" page**
   - Full-width layout with no login required
   - Style agent to match brand voice
   - Add example prompts in placeholder text
6. **Build About page**
   - Describe how Archie is trained
   - Explain affiliate transparency + trust signals
7. **Build Terms & Disclosures page**
   - Write plain-English disclosure on affiliate links
   - Add privacy policy and cookie statement
8. **Set up affiliate intent tagging logic**
   - Add basic keyword triggers (e.g. “warranty”, “loan”)
   - Display links below relevant answers
9. **Deploy to Lovable Cloud**
   - Set up hosting, SSL, basic SEO metadata

### Phase 2 — V1 Features
1. Add contextual CTA cards below select responses
2. Begin click tracking + outbound link monitoring
3. Optimize mobile UI for one-handed use
4. Create 404 page and lightweight sitemap
5. Add favicon and custom meta previews

---

## 📆 Timeline with Checkpoints

| Week | Milestone |
|------|-----------|
| 1 | Project scaffolding + Tailwind + ChatBase setup |
| 2 | Homepage + Chat page built & styled |
| 3 | Train Archie + integrate About + Terms pages |
| 4 | Add affiliate logic + deploy MVP |
| 5 | Collect feedback + test trigger logic |
| 6 | Launch Phase 2: CTA blocks + tracking |
| 7 | Mobile polish + analytics reports |
| 8 | Sprint review, prep for V1 testing |

---

## 👥 Team Roles & Recommended Rituals

### Suggested Roles
- **Founder / PM** — own the roadmap and affiliate logic
- **Frontend Dev** — implement pages + styling
- **Content Curator** — manage Archie’s training materials
- **UX Designer** — oversee visual polish + accessibility
- **Affiliate Manager** — track performance, maintain compliance

### Weekly Rituals
- **Monday check-in:** goals, blockers, link reviews  
- **Thursday QA hour:** test affiliate triggers live  
- **Friday async update:** usage stats, wins, next steps  
- **Bi-weekly usability test:** 3 users, 30 minutes, log confusion points

---

## 🔌 Optional Integrations & Stretch Goals
- Email summary tool (send user their Q&A session)
- Dealer inventory plugin (future revenue stream)
- Voice input for mobile users
- CRM webhook (e.g. HubSpot or Airtable)
- Multilingual agent toggle (start with Spanish)

