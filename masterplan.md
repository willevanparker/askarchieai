## 🧠 30-Second Elevator Pitch
AskArchie.ai is a friendly AI-powered assistant that answers any car-related question—buying, repairs, fees, financing, and more. Built for consumers who want fast, trustworthy info without dealership jargon. Archie combines expert knowledge and smart affiliate logic, making it both helpful and revenue-generating.

## 🛠 Problem & Mission
- **Problem:** Car buyers and owners face confusing industry terms, hidden fees, and unclear service processes.
- **Mission:** Demystify the car world through a conversational AI assistant that’s friendly, accurate, and always on your side.

## 🎯 Target Audience
- First-time car buyers  
- Repeat shoppers comparing options  
- Owners with service or parts questions  
- Anyone confused by warranties, fees, dealership practices, or financing  
- Users researching state-specific car laws or DMV processes

## 🌟 Core Features
- **Homepage:** modern design with bold CTA ("Car question? Ask Archie!") and embedded chat
- **Chat With Archie:** full-width AI chat UI via ChatBase, trained on expert data
- **Smart Intent Detection:** triggers relevant affiliate links (e.g., warranty, financing)
- **About Page:** explains Archie’s expertise and affiliate transparency
- **Terms Page:** clear disclosures for compliance and trust

## 🧰 High-Level Tech Stack
- **Frontend:** React + Vite + TypeScript — fast, modern, great DX  
- **Styling/UI:** Tailwind CSS + shadcn/ui — scalable design system with built-in accessibility  
- **Backend & Hosting:** Lovable Cloud — simple deploys and static site-friendly  
- **AI Engine:** ChatBase — custom-trained agent using uploaded car industry content  
- **Auth:** None for MVP — instant access, no login friction

## 🗃 Conceptual Data Model (ERD in Words)
- **UserSession**  
  - questionText  
  - answerText  
  - timestamp  
  - affiliateTrigger (optional)  
- **KnowledgeSource**  
  - type (PDF, CSV, URL, screenshot)  
  - contentSummary  
  - uploadDate  
- **AffiliateLink**  
  - intentTag (e.g. warranty, financing)  
  - destinationURL  
  - displayText  

## 🎨 UI Design Principles
- **Don’t Make Me Think:** plain-English language, visible CTAs, mobile-first layout  
- **Make It Feel Human:** friendly tone, smart illustrations, helpful microcopy  
- **Design for Scanning:** bullet answers, bold questions, suggested follow-ups  
- **Trust Signals Up Front:** explain Archie’s training, show transparency about links

## 🔐 Security & Compliance Notes
- No account/login = fewer data risks for MVP  
- Required: clear affiliate disclosure (FTC compliant)  
- Optional: cookie banner if analytics added  
- Long-term: anonymized chat logs only; no PII collection

## 🗺 Phased Roadmap

### 🧪 MVP
- Homepage + “Ask Archie” full-screen chat
- Train ChatBase agent on car industry PDFs, CSVs, URLs
- Add About + Terms/Disclosures page
- Launch with basic affiliate link triggers (e.g. warranties)

### 🚀 V1
- Add contextual CTA modules below answers
- Begin testing affiliate conversion data
- Mobile interaction improvements (suggestions, emoji support)

### 🧠 V2
- Add light onboarding ("What are you here for?")
- State-specific personalization (e.g. show DMV fee links by ZIP)
- Add natural language summaries of uploaded docs
- Optional: Light account system to save Q&A threads

## ⚠️ Risks & Mitigations
- **Affiliate links feel intrusive →** Only trigger when contextually relevant; explain in About page  
- **Mistrust in AI answers →** Emphasize source training; link out to citations where possible  
- **Wrong answers from ChatBase →** Regular testing + retrain with updated content monthly  
- **Low engagement →** Strong CTA, examples, and homepage UX modeled on conversion-driven sites like Lemonade

## 🌱 Future Expansion Ideas
- Local dealership Q&A integration  
- Post-chat email summaries  
- Voice input  
- Spanish-language support  
- Service appointment scheduling integrations (e.g. RepairPal, DealerRater)
