# The Brand Box

An AI-guided branding platform that transforms a structured business brief into a personalized creative direction and a complete, ready-to-use visual identity.

## Live demo

**Public platform:**  
https://thebrandbox.sonhodepapel.com/

**Demo access for judges:**  
https://thebrandbox.sonhodepapel.com/br/?demo=BUILDWEEK100

The demo link enables the full creation, checkout, and post-payment experience without any real charge. No credentials are required.

## Project overview

Professional branding can be expensive, intimidating, and difficult to navigate for small businesses and first-time founders.

Many people know what they want their brand to communicate, but struggle to translate those ideas into a coherent visual identity.

The Brand Box guides users through a structured creative journey, helping them move from strategy and positioning to colors, typography, tagline, patterns, brand applications, and downloadable assets.

The platform is based on a branding methodology developed through more than a decade of professional graphic design work with small businesses.

## What the platform does

Users can:

- complete a structured branding questionnaire;
- define their audience, goals, personality, and visual preferences;
- receive a curated creative direction;
- access a personalized AI Creative Director diagnosis;
- identify and resolve tensions in the briefing;
- refine the recommended direction;
- explore personalized color palettes;
- select typography and supporting fonts;
- generate brand-specific tagline suggestions;
- choose icons and visual elements;
- create and customize brand patterns;
- preview a complete visual brand board;
- customize digital and printed applications;
- edit colors, spacing, alignment, scale, and contact information;
- download updated, ready-to-use files whenever needed.

The experience is available in Portuguese and English.

## OpenAI Build Week

The Brand Box existed before OpenAI Build Week as a functioning Next.js application with:

- a structured onboarding questionnaire;
- a curated library of visual styles;
- a Gemini-based creative matchmaker;
- palette, typography, icon, and pattern selection;
- checkout;
- a post-purchase brand delivery environment.

During OpenAI Build Week, the platform gained a new AI Creative Director layer powered by the OpenAI Responses API.

## What was built during Build Week

The new system can:

- generate a structured creative diagnosis;
- explain why a selected direction fits the brand;
- identify emotional goals and audience expectations;
- detect unresolved tensions in the briefing;
- ask one focused refinement question;
- interpret the user’s response;
- refine the creative direction;
- generate personalized color palette options;
- provide palette feedback and usage guidance;
- generate short, brand-specific tagline suggestions;
- adapt tagline length to the visual length of the brand name;
- preserve multilingual content;
- prevent unnecessary duplicate requests;
- maintain fallbacks when an AI request fails.

The OpenAI layer does not replace the curated creative system.

Gemini continues to select from the existing visual directions, while the OpenAI Creative Director explains, refines, and personalizes the result.

## How Codex was used

Codex was used throughout the Build Week development process to work safely inside an existing codebase.

Codex helped:

- analyze and map the existing Next.js repository;
- trace questionnaire state across the application;
- identify the current Gemini matchmaker flow;
- create isolated server-side API routes;
- integrate the OpenAI Responses API;
- define structured JSON schemas;
- implement validation and safe fallbacks;
- connect AI responses to the existing front-end flow;
- preserve the previous experience when OpenAI is unavailable;
- improve multilingual regeneration;
- prevent duplicate requests;
- implement usage guards for pre-purchase AI calls;
- integrate personalized palettes into the existing refinement step;
- improve tagline, typography, icon, and brand-board logic;
- diagnose Vercel environment and deployment issues;
- improve responsive behavior;
- document the Build Week architecture;
- review diffs and ship changes incrementally through Git branches and pull requests.

The project was extended incrementally instead of being rebuilt from scratch.

## AI architecture

The Brand Box uses a hybrid AI architecture:

### Gemini

Gemini analyzes the questionnaire and selects the most appropriate direction from the curated visual-style library.

### OpenAI Creative Director

The OpenAI layer receives:

- the structured briefing;
- the selected style;
- the matchmaker result;
- the current language;
- relevant user refinements.

It returns structured creative guidance for:

- diagnosis;
- refinement;
- palettes;
- taglines;
- tone of voice;
- manifesto;
- visual recommendations.

All OpenAI calls happen server-side.

API keys are stored in Vercel environment variables and are never exposed in the browser.

## Safety and fallbacks

The application includes:

- server-side validation;
- structured outputs;
- API error handling;
- multilingual fallbacks;
- duplicate-request protection;
- usage limits for pre-purchase flows;
- preservation of the original Gemini-based experience if OpenAI fails.

The user is never blocked from continuing solely because an AI request fails.

## Technology stack

- Next.js
- React
- Vercel
- OpenAI Responses API
- Codex
- Gemini
- Supabase
- Stripe
- GitHub

## Local development

Clone the repository:

```bash
git clone https://github.com/cintiapettersen/the-brand-box.git
cd the-brand-box
