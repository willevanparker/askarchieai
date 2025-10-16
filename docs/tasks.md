# AskArchie.ai — Implementation Tasks

**Last Updated:** 2025-10-15  
**Status:** MVP In Progress  
**ChatBase Bot ID:** `06a81a19-258d-4b0c-99b0-1c7781226da2`

---

## 📋 Task Status Legend
- ✅ **Completed**
- 🚧 **In Progress**
- ⏳ **Pending**
- ❌ **Blocked**

---

## Phase 1: MVP Launch (Weeks 1-4)

### 1.1 Project Foundation ✅

**Status:** ✅ Completed

**Subtasks:**
- ✅ Initialize Vite + React + TypeScript project
- ✅ Install Tailwind CSS and shadcn/ui
- ✅ Configure base routing with React Router
- ✅ Set up design system in `index.css` and `tailwind.config.ts`

**Files Modified:**
- `package.json` (dependencies)
- `tailwind.config.ts`
- `src/index.css`
- `src/App.tsx`

---

### 1.2 Design System Implementation ✅

**Status:** ✅ Completed

**Subtasks:**
- ✅ Define color palette with HSL semantic tokens
- ✅ Configure typography (Inter font)
- ✅ Set up spacing and shadow utilities
- ✅ Create light/dark mode variants

**Color Tokens (HSL):**
```css
/* src/index.css */
:root {
  --primary: 210 80% 39%;        /* #0A64BC */
  --accent: 18 100% 60%;          /* #FF6B35 for A and i */
  --background: 0 0% 98%;         /* #FAFAFA */
  --foreground: 0 0% 13%;         /* #212121 */
  --muted: 0 0% 95%;              /* #F1F1F1 */
}
```

**Files:**
- `src/index.css` ✅
- `tailwind.config.ts` ✅

---

### 1.3 Homepage Layout 🚧

**Status:** 🚧 In Progress (needs ChatBase integration)

**Subtasks:**
- ✅ Create Navbar component with branded logo
- ✅ Build Hero section with CTA
- ✅ Generate hero illustration
- ✅ Add "A" and "i" accent coloring in logo
- ⏳ Embed ChatBase iframe with bot ID `06a81a19-258d-4b0c-99b0-1c7781226da2`
- ✅ Create Footer component

**Key Implementation:**

```tsx
// src/components/Navbar.tsx - Logo with accent colors
<Link to="/" className="text-xl font-bold">
  Ask
  <span className="text-accent">A</span>
  rch
  <span className="text-accent">i</span>
  e.ai
</Link>
```

**ChatBase Embed (TO DO):**
```tsx
// src/components/ChatBaseEmbed.tsx
export const ChatBaseEmbed = () => {
  return (
    <iframe
      src="https://www.chatbase.co/chatbot-iframe/06a81a19-258d-4b0c-99b0-1c7781226da2"
      title="Archie AI Assistant"
      width="100%"
      height="100%"
      frameBorder="0"
      className="rounded-lg shadow-elegant"
    />
  );
};
```

**Files:**
- ✅ `src/components/Navbar.tsx`
- ✅ `src/components/Hero.tsx`
- ✅ `src/components/Footer.tsx`
- ⏳ `src/components/ChatBaseEmbed.tsx` (TO CREATE)
- ✅ `src/pages/Index.tsx`

---

### 1.4 Chat Page Implementation 🚧

**Status:** 🚧 In Progress (ChatBase iframe integrated on `/chat`)

**Subtasks:**
- ✅ Create `/chat` route
- ✅ Build mock ChatInterface component
- ✅ Replace mock with ChatBase iframe embed
- ⏳ Add example prompt suggestions
- ⏳ Style ChatBase iframe to match brand

**Files:**
- ✅ `src/pages/Chat.tsx`
- 🛈 `src/components/ChatInterface.tsx` (legacy mock; not used)
- ⏳ `src/components/ExamplePrompts.tsx` (TO CREATE)
- ✅ `src/components/ChatBaseEmbed.tsx`

---

### 1.5 About Page ✅

**Status:** ✅ Completed

**Subtasks:**
- ✅ Create `/about` route
- ✅ Add "How Archie Is Trained" section
- ✅ Add "Transparency & Trust" section
- ✅ Add "Who Archie Helps" section
- ✅ Include affiliate disclosure

**Files:**
- ✅ `src/pages/About.tsx`

---

### 1.6 Terms & Disclosures Page ✅

**Status:** ✅ Completed

**Subtasks:**
- ✅ Create `/terms` route
- ✅ Write FTC-compliant affiliate disclosure
- ✅ Add privacy policy section
- ✅ Add information accuracy disclaimer
- ✅ Add service availability terms

**Files:**
- ✅ `src/pages/Terms.tsx`

---

### 1.7 Affiliate Intent Detection System ⏳

**Status:** ⏳ Pending (Phase 1 priority)

**Strategy:** Client-side keyword matching on ChatBase responses for MVP

**Subtasks:**
- ⏳ Create affiliate link configuration
- ⏳ Build intent detection utility
- ⏳ Create AffiliateCTA component
- ⏳ Integrate with ChatInterface
- ⏳ Test trigger accuracy

**Intent Configuration:**
```typescript
// src/lib/affiliateConfig.ts
export interface AffiliateLink {
  id: string;
  intentKeywords: string[];
  displayText: string;
  url: string;
  description: string;
  category: 'warranty' | 'financing' | 'insurance' | 'parts' | 'service';
}

export const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    id: 'extended-warranty',
    intentKeywords: [
      'warranty', 'extended warranty', 'coverage',
      'check engine', 'repair coverage', 'mechanical breakdown'
    ],
    displayText: 'Check Extended Warranty Options',
    url: 'https://affiliate-partner.com/warranty?ref=askarchie',
    description: 'Compare warranty plans that could cover this repair',
    category: 'warranty'
  },
  {
    id: 'car-financing',
    intentKeywords: [
      'financing', 'loan', 'apr', 'interest rate',
      'monthly payment', 'pre-approval', 'credit score'
    ],
    displayText: 'Get Pre-Approved for Auto Financing',
    url: 'https://affiliate-partner.com/financing?ref=askarchie',
    description: 'See your rate in minutes without impacting credit',
    category: 'financing'
  },
  {
    id: 'car-insurance',
    intentKeywords: [
      'insurance', 'gap insurance', 'collision',
      'comprehensive', 'liability', 'insurance quote'
    ],
    displayText: 'Compare Car Insurance Rates',
    url: 'https://affiliate-partner.com/insurance?ref=askarchie',
    description: 'Get personalized quotes from top providers',
    category: 'insurance'
  },
  {
    id: 'car-parts',
    intentKeywords: [
      'parts', 'replacement', 'aftermarket',
      'oem', 'brake pads', 'filters', 'battery'
    ],
    displayText: 'Shop Quality Car Parts',
    url: 'https://affiliate-partner.com/parts?ref=askarchie',
    description: 'Find OEM and aftermarket parts at great prices',
    category: 'parts'
  }
];
```

**Intent Detection Utility:**
```typescript
// src/lib/intentDetection.ts
import { AFFILIATE_LINKS, AffiliateLink } from './affiliateConfig';

export function detectIntent(messageText: string): AffiliateLink | null {
  const lowerText = messageText.toLowerCase();
  
  // Find first matching affiliate link based on keywords
  for (const link of AFFILIATE_LINKS) {
    const hasMatch = link.intentKeywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      return link;
    }
  }
  
  return null;
}

// Track when affiliate links are shown (for analytics)
export function logAffiliateImpression(affiliateId: string, query: string) {
  // For MVP: console.log
  // Phase 2: send to analytics endpoint
  console.log('[Affiliate Impression]', {
    affiliateId,
    query,
    timestamp: new Date().toISOString()
  });
}

// Track when affiliate links are clicked
export function logAffiliateClick(affiliateId: string) {
  console.log('[Affiliate Click]', {
    affiliateId,
    timestamp: new Date().toISOString()
  });
}
```

**AffiliateCTA Component:**
```tsx
// src/components/AffiliateCTA.tsx
import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AffiliateLink } from '@/lib/affiliateConfig';
import { logAffiliateClick } from '@/lib/intentDetection';

interface AffiliateCTAProps {
  affiliate: AffiliateLink;
}

export const AffiliateCTA = ({ affiliate }: AffiliateCTAProps) => {
  const handleClick = () => {
    logAffiliateClick(affiliate.id);
    window.open(affiliate.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-4 bg-accent/5 border-accent/20 mt-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">
            {affiliate.displayText}
          </h4>
          <p className="text-xs text-muted-foreground">
            {affiliate.description}
          </p>
        </div>
        <Button
          onClick={handleClick}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          View Options
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        *Affiliate link - We may earn a commission
      </p>
    </Card>
  );
};
```

**Integration with ChatInterface:**
```tsx
// Update src/components/ChatInterface.tsx
import { detectIntent, logAffiliateImpression } from '@/lib/intentDetection';
import { AffiliateCTA } from './AffiliateCTA';

// In the message rendering logic:
{message.role === "assistant" && (
  <>
    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
      {message.content}
    </p>
    {(() => {
      const affiliate = detectIntent(message.content);
      if (affiliate) {
        logAffiliateImpression(affiliate.id, message.content);
        return <AffiliateCTA affiliate={affiliate} />;
      }
      return null;
    })()}
  </>
)}
```

**Files to Create:**
- ⏳ `src/lib/affiliateConfig.ts`
- ⏳ `src/lib/intentDetection.ts`
- ⏳ `src/components/AffiliateCTA.tsx`

**Files to Update:**
- ⏳ `src/components/ChatInterface.tsx` (add intent detection)

---

### 1.8 SEO & Meta Tags ⏳

**Status:** ⏳ Pending

**Subtasks:**
- ⏳ Add comprehensive meta tags to `index.html`
- ⏳ Create sitemap.xml
- ⏳ Add robots.txt
- ⏳ Generate favicon set
- ⏳ Add Open Graph tags
- ⏳ Add Twitter Card tags
- ⏳ Add JSON-LD structured data

**Meta Tags Implementation:**
```html
<!-- index.html - Add to <head> -->
<meta name="description" content="Ask Archie - Your trusted AI assistant for car questions. Get expert answers on buying, repairs, financing, warranties, and more." />
<meta name="keywords" content="car questions, auto advice, car buying, car repair, extended warranty, car financing, dealership fees" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="AskArchie.ai - Your Trusted Car Expert" />
<meta property="og:description" content="Get instant answers to all your car questions from Archie, your AI car expert." />
<meta property="og:image" content="https://askarchie.ai/og-image.png" />
<meta property="og:url" content="https://askarchie.ai" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AskArchie.ai - Your Trusted Car Expert" />
<meta name="twitter:description" content="Get instant answers to all your car questions from Archie, your AI car expert." />
<meta name="twitter:image" content="https://askarchie.ai/twitter-card.png" />

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AskArchie.ai",
  "description": "AI-powered car expert answering questions about buying, repairs, financing, and more",
  "url": "https://askarchie.ai",
  "applicationCategory": "UtilitiesApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

**Sitemap.xml:**
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://askarchie.ai/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://askarchie.ai/chat</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://askarchie.ai/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://askarchie.ai/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

**Files:**
- ⏳ `index.html` (update meta tags)
- ⏳ `public/sitemap.xml` (create)
- ✅ `public/robots.txt` (exists)

---

### 1.9 Mobile Optimization ⏳

**Status:** ⏳ Pending

**Subtasks:**
- ⏳ Test responsive layouts on mobile viewports
- ⏳ Optimize touch targets (min 44x44px)
- ⏳ Add viewport meta tag for proper scaling
- ⏳ Test ChatBase iframe responsiveness
- ⏳ Add mobile-specific styles for chat interface

**Viewport Configuration:**
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
```

**Mobile Touch Targets:**
```css
/* src/index.css */
@media (max-width: 768px) {
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

### 1.10 Deployment to Lovable Cloud ⏳

**Status:** ⏳ Pending (after ChatBase integration)

**Subtasks:**
- ⏳ Test build locally (`npm run build`)
- ⏳ Fix any build errors
- ⏳ Deploy via Lovable Cloud interface
- ⏳ Configure custom domain (if ready)
- ⏳ Test live site on multiple devices
- ⏳ Monitor console for errors

**Pre-deployment Checklist:**
- [ ] All pages load without errors
- [ ] ChatBase iframe is working
- [ ] Affiliate CTAs trigger correctly
- [ ] Mobile layout is responsive
- [ ] SEO meta tags are present
- [ ] Links in footer work
- [ ] 404 page exists

**Files:**
- ✅ `src/pages/NotFound.tsx` (exists)

---

## Phase 2: V1 Features (Weeks 5-8)

### 2.1 Enhanced Affiliate CTA Modules ⏳

**Status:** ⏳ Not Started

**Subtasks:**
- ⏳ Create contextual card variants
- ⏳ Add "Dismiss" functionality
- ⏳ Create sticky sidebar CTA option
- ⏳ A/B test inline vs. sidebar placement

**Enhanced CTA Card:**
```tsx
// src/components/EnhancedAffiliateCTA.tsx
export const EnhancedAffiliateCTA = ({ affiliate, variant = 'inline' }: Props) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Card className={cn(
      "p-6 bg-gradient-to-br from-primary/5 to-accent/5",
      variant === 'sidebar' && "sticky top-4"
    )}>
      {/* Enhanced card with image, testimonial, etc. */}
    </Card>
  );
};
```

---

### 2.2 Analytics & Click Tracking ⏳

**Status:** ⏳ Not Started

**Backend Required:** Yes (Lovable Cloud)

**Subtasks:**
- ⏳ Enable Lovable Cloud
- ⏳ Create analytics database schema
- ⏳ Build event tracking system
- ⏳ Create admin dashboard for metrics
- ⏳ Track: impressions, clicks, conversions

**Database Schema (Supabase):**
```sql
-- Create affiliate_events table
CREATE TABLE affiliate_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'impression', 'click'
  affiliate_id TEXT NOT NULL,
  user_query TEXT,
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for querying
CREATE INDEX idx_affiliate_events_type ON affiliate_events(event_type);
CREATE INDEX idx_affiliate_events_created ON affiliate_events(created_at);

-- RLS Policies (public can insert, only admins can read)
ALTER TABLE affiliate_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track events"
  ON affiliate_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can read events"
  ON affiliate_events FOR SELECT
  USING (auth.role() = 'authenticated'); -- Update based on admin role
```

**Tracking Functions:**
```typescript
// src/lib/analytics.ts (Phase 2)
import { supabase } from '@/lib/supabase';

export async function trackAffiliateEvent(
  eventType: 'impression' | 'click',
  affiliateId: string,
  userQuery?: string
) {
  const sessionId = getOrCreateSessionId(); // localStorage session tracking

  await supabase.from('affiliate_events').insert({
    event_type: eventType,
    affiliate_id: affiliateId,
    user_query: userQuery,
    session_id: sessionId
  });
}

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('archie_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('archie_session_id', sessionId);
  }
  return sessionId;
}
```

---

### 2.3 Mobile UX Improvements ⏳

**Status:** ⏳ Not Started

**Subtasks:**
- ⏳ Add swipe gestures to dismiss CTAs
- ⏳ Implement "scroll to new message" button
- ⏳ Add haptic feedback for button presses
- ⏳ Test on iOS Safari and Android Chrome

---

### 2.4 Admin Dashboard (Optional) ⏳

**Status:** ⏳ Not Started

**Backend Required:** Yes (Lovable Cloud + Auth)

**Subtasks:**
- ⏳ Create `/admin` route with auth
- ⏳ Build analytics charts (impressions, CTR)
- ⏳ Show top-performing affiliates
- ⏳ Export data as CSV

**Admin Route Protection:**
```tsx
// src/pages/Admin.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1>Analytics Dashboard</h1>
      {/* Charts and metrics */}
    </div>
  );
};
```

---

### 2.5 Conversation History (Optional) ⏳

**Status:** ⏳ Not Started

**Backend Required:** Yes (Lovable Cloud + Auth)

**Subtasks:**
- ⏳ Add user authentication
- ⏳ Store conversation sessions in database
- ⏳ Create "My Conversations" page
- ⏳ Allow users to resume conversations

**Database Schema:**
```sql
-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );
```

---

## Phase 3: V2 Features (Future)

### 3.1 State-Specific Personalization ⏳

**Subtasks:**
- ⏳ Detect user location (IP or ZIP input)
- ⏳ Load state-specific fee data
- ⏳ Show DMV/registration info by state
- ⏳ Personalize affiliate offers by region

---

### 3.2 Multilingual Support ⏳

**Subtasks:**
- ⏳ Add Spanish language toggle
- ⏳ Train separate ChatBase agent for Spanish
- ⏳ Translate UI components

---

### 3.3 Voice Input ⏳

**Subtasks:**
- ⏳ Add Web Speech API integration
- ⏳ Create microphone button in chat
- ⏳ Test on mobile browsers

---

### 3.4 Email Summaries ⏳

**Subtasks:**
- ⏳ Add email capture form
- ⏳ Create email template
- ⏳ Send conversation summary via email

---

## Testing Checklist

### Manual QA (Before Each Deployment)
- [ ] Homepage loads with correct logo colors
- [ ] ChatBase iframe renders correctly
- [ ] Affiliate CTAs trigger on relevant queries
- [ ] All navigation links work
- [ ] Mobile layout is responsive
- [ ] Footer links are correct
- [ ] About page content is accurate
- [ ] Terms page includes all disclosures
- [ ] 404 page shows for invalid routes

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (desktop + iOS)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Chrome (Android)

### Performance Testing
- [ ] Lighthouse score > 90 (mobile)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] ChatBase iframe loads < 2s

---

## Documentation References

- **Masterplan:** `docs/masterplan.md`
- **Implementation Plan:** `docs/implementation-plan.md`
- **Design Guidelines:** `docs/design-guidelines.md`
- **App Flow:** `docs/app-flow-pages-and-roles.md`

---

## Next Steps (Immediate Priorities)

1. **Integrate ChatBase iframe** into Homepage and Chat page
2. **Build affiliate detection system** with keyword matching
3. **Create AffiliateCTA component** with tracking
4. **Test affiliate triggers** with real ChatBase responses
5. **Deploy MVP** to Lovable Cloud

---

## Notes & Decisions

- **Affiliate Strategy:** Client-side keyword matching for MVP, move to ChatBase structured responses in V2
- **Backend:** Lovable Cloud only needed for Phase 2 (analytics, auth)
- **Analytics:** Console logging for MVP, Supabase events table for Phase 2
- **Mobile:** Full responsive design priority, PWA features in V2
