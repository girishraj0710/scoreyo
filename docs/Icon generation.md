Illustration Policy

**CANONICAL REFERENCE**: `/Users/girish.raj/Downloads/ChatGPT Image Jun 24, 2026, 05_00_46 PM.png`

**MANDATORY**: ALL future icons MUST match the style shown in the canonical reference screenshot above.

Krakkify does NOT use standard outline icons
for primary navigation or feature cards.

Instead, every major feature must use
a custom illustrated icon that follows the
EXACT style shown in the reference screenshot.

Each illustrated icon MUST:

• be colorful (distinct color per icon category)
• have gradient backgrounds (from-to color transitions)
• have depth (soft shadows, layered elements)
• have rounded geometry (rounded-xl corners on containers)
• use consistent lighting (top-left light source)
• use consistent shadows (soft, subtle shadow-sm/md)
• feel friendly (approachable, not corporate)
• feel premium (polished, high-quality gradients)
• feel modern (glass-morphism, smooth transitions)
• match the Krakkify Iconography System style

Every illustration should look like
it belongs to the same illustration family
as shown in the reference screenshot.

Think:

Quizlet

Duolingo

Canva

Google Workspace

Notion Calendar

**Reference Screenshot Examples:**
The canonical reference shows perfect examples across categories:
- Learning & Courses: Blue gradients, book/document shapes
- Performance & Analytics: Purple gradients, chart/graph shapes
- Practice & Daily: Orange gradients, checkmark/target shapes
- AI Tools Features: Pink/purple gradients, sparkle/brain shapes
- Achievements & Rewards: Gold/yellow gradients, trophy/star shapes

Do not use emojis.

Do not use Lucide icons alone
for feature illustrations.

Use illustrated SVG icons with:
- Gradient backgrounds
- White icon symbols
- Rounded containers (rounded-xl)
- Soft shadows
- Depth and lighting

Illustrations should communicate
the feature visually AND match
the Krakkify Iconography System style.
Example (Based on Reference Screenshot)

Instead of a plain Book icon

Claude should create

**Study Icon (Blue gradient style)**
- Container: w-12 h-12 rounded-xl
- Background: bg-gradient-to-br from-[#5B7CFF] to-[#4A6AE8]
- Icon: BookOpen component in white, w-6 h-6, strokeWidth={2}
- Shadow: shadow-sm
- Hover: Brightens gradient (from-[#6B8CFF] to-[#5B7CFF])
- Matches: "Courses" section in reference screenshot

Instead of a plain Quiz icon

Claude should create

**Practice Icon (Orange gradient style)**
- Container: w-12 h-12 rounded-xl
- Background: bg-gradient-to-br from-[#F59E0B] to-[#D97706]
- Icon: Target or CheckCircle in white, w-6 h-6, strokeWidth={2}
- Shadow: shadow-sm
- Hover: Brightens gradient
- Matches: "Daily Practice" section in reference screenshot

Instead of plain Analytics

Claude should create

**Analytics Icon (Purple gradient style)**
- Container: w-12 h-12 rounded-xl
- Background: bg-gradient-to-br from-[#7C3AED] to-[#6D28D9]
- Icon: BarChart3 or TrendingUp in white, w-6 h-6, strokeWidth={2}
- Shadow: shadow-sm
- Hover: Brightens gradient
- Matches: "Performance & Analytics" section in reference screenshot
## Krakkify Illustration Bible (Based on Reference Screenshot)

**Color Coding System:**

| Feature Category | Color | Gradient From-To | Example Use Cases |
|-----------------|-------|------------------|-------------------|
| **Learning & Courses** | Blue | `from-[#5B7CFF] to-[#4A6AE8]` | Study, Courses, Topics, Lessons |
| **Performance & Analytics** | Purple | `from-[#7C3AED] to-[#6D28D9]` | Stats, Reports, Progress, Analytics |
| **Practice & Daily** | Orange | `from-[#F59E0B] to-[#D97706]` | Quiz, Practice, DPP, Exercises |
| **AI Tools** | Pink/Purple | `from-[#EC4899] to-[#D946EF]` | AI Tutor, Clarify, Smart features |
| **Achievements** | Gold/Yellow | `from-[#F59E0B] to-[#EA580C]` | Leaderboard, Trophies, Rewards |
| **Revision & Review** | Green | `from-[#10B981] to-[#059669]` | Spaced Review, Revision, Mistakes |
| **Tests & Mocks** | Teal | `from-[#14B8A6] to-[#0D9488]` | Mock Tests, Exams, Assessments |
| **Real-world Skills** | Indigo | `from-[#6366F1] to-[#4F46E5]` | Communication, Presentation |

**Standard Icon Specification:**

```tsx
// Small Cards (Topic cards, feature buttons)
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[COLOR1] to-[COLOR2] group-hover:from-[LIGHTER1] group-hover:to-[LIGHTER2] flex items-center justify-center transition-all shadow-sm">
  <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
</div>

// Large Cards (Major feature sections, path cards)
<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[COLOR1] to-[COLOR2] group-hover:from-[LIGHTER1] group-hover:to-[LIGHTER2] flex items-center justify-center transition-all shadow-md">
  <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
</div>
```

**Mandatory Attributes:**
- Container: Always `rounded-xl` (12px radius)
- Icon: Always white color (`text-white`)
- Stroke: Always `strokeWidth={2}` for boldness
- Shadow: `shadow-sm` for small, `shadow-md` for large
- Hover: Brightens gradient by ~10-15%
- Transition: `transition-all` for smooth animations

Now every illustration is generated from the same system
AND matches the reference screenshot style exactly.

Even Better (What I'd do if I were building Krakkify)

I wouldn't ask Claude to generate these icons at all.

I'd create a dedicated Krakkify Illustration Design System with around 150–250 reusable illustrated SVG assets covering every feature, subject, achievement, state, and workflow. Every illustration would share the same:

Color palette
Stroke style
Corner radius
Lighting direction
Shadow style
Perspective
Brand personality

Claude would then reuse this illustration library rather than generating new artwork for each screen. This gives your product the same visual consistency that users recognize in products like Quizlet, Duolingo, and Canva.

In other words:

❌ AI generates a different icon every time.
✅ AI selects from a curated Krakkify Illustration Library and only commissions new illustrations when a genuinely new concept is introduced.

---

## Implementation Status (June 24, 2026)

**Current Approach:** Hybrid - Lucide Icons + Gradient Backgrounds

We're currently using Lucide React icons with illustrated gradient backgrounds that match the reference screenshot style. This gives us:

✅ **Implemented:**
- Gradient background containers (colorful, depth, shadows)
- White icon symbols on colored backgrounds
- Rounded geometry (rounded-xl)
- Consistent lighting (top-left)
- Color-coded categories (blue, purple, orange, teal, etc.)
- Smooth hover transitions
- Shadow depth (shadow-sm/md)
- Professional, premium feel

✅ **Files Using This System:**
- `/src/lib/icons.ts` - Centralized icon registry
- `/src/app/learn/english/foundation/page.tsx` - Blue gradient (Learning)
- `/src/app/learn/english/advanced/page.tsx` - Purple gradient (Advanced)
- `/src/app/learn/english/ielts-toefl/page.tsx` - Teal gradient (Test Prep)
- All English learning path pages (100% compliant)

⏳ **Future Enhancement:** Custom SVG Illustrations

When ready to level up, create custom SVG illustrations that:
- Replace Lucide icons with bespoke artwork
- Maintain the same color palette and style
- Add unique brand personality
- Create illustration families (150-250 assets)
- Match the reference screenshot aesthetic exactly

**Reference Screenshot Path:**
`/Users/girish.raj/Downloads/ChatGPT Image Jun 24, 2026, 05_00_46 PM.png`

**Policy:** This screenshot is the CANONICAL REFERENCE for all future icon work. Every new section, feature, or component MUST follow this exact style.

---

## Quick Reference for Claude

**When creating ANY new icon:**

1. Check the canonical reference screenshot first
2. Identify the feature category (Learning, Practice, Analytics, etc.)
3. Use the corresponding color from the Illustration Bible table
4. Apply the standard icon specification (w-12 h-12, rounded-xl, gradient, white icon, shadow)
5. Ensure it looks like it belongs to the Krakkify family
6. Test hover states (gradient brightening)
7. Verify accessibility (aria-labels, tooltips)

**Never:**
- Use plain outline icons without gradients
- Use emojis
- Invent random colors outside the palette
- Create flat icons without depth
- Skip shadows or rounded corners
- Use different icon sizes inconsistently