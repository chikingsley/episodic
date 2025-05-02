# Verification of Text-to-Speech and Speech-to-Text Service Pricing

## 1. Introduction

### Objective

This report provides a verification of the pricing and service details presented in the "Detailed Pricing Report for TTS and STT Services," dated May 2, 2025. The verification process involves cross-referencing the claims made in the report against information contained within provided research materials.

### Scope

The analysis encompasses all service providers listed in the initial report. Verification focuses on pricing structures (including tiers and pay-as-you-go rates), usage limitations (characters, minutes, hours, credits), key features (such as API access, voice cloning capabilities, language support, commercial usage rights, concurrency limits), and the availability of Text-to-Speech (TTS) versus Speech-to-Text (STT) services for each provider.

### Methodology

Each data point presented in the original report for a specific provider is compared against relevant statements found in the available research materials. The findings for each data point are categorized as Confirmed, Discrepant, Partially Confirmed, or Unclear/Not Found. Specific source identifiers are cited as evidence for these findings. Identified discrepancies and ambiguities are analyzed to understand potential causes and implications for users evaluating these services.

### Report Value

This verification furnishes users, assumed to be Business Analysts, Product Managers, or Market Researchers, with a validated and critically assessed dataset. This dataset can be utilized for competitive analysis, vendor evaluation, strategic planning, or budgeting related to TTS and STT services. The report highlights areas where the initial data is confirmed, where it deviates from available evidence, and where further investigation or caution is warranted.

## 2. Provider Pricing Verification

### 2.1 Fish Audio

**Summary:** Partially Confirmed with Significant Discrepancy/Ambiguity. Details regarding the free and premium subscription plans are largely corroborated by the research materials. However, a significant contradiction exists concerning the pricing model for the API access. Furthermore, the availability and pricing structure for STT services remain unclear.

**Detailed Findings:**

- **TTS Focus:** Confirmed. Fish Audio primarily offers TTS services, emphasizing ultra-realistic voices and voice cloning capabilities.
- **Free Plan ($0):** Confirmed. The plan includes 1 hour of ultra-realistic voice generation per month, operates at standard speed, limits clips to approximately 3 minutes, and excludes API credit.
- **Premium Plan ($9.99/month):** Confirmed. The monthly price is $9.99 when billed monthly, with an annual billing option available at $6.66 per month, reflecting the 33% discount noted in the original report. Features include unlimited generations within the web interface, priority generation speed, and an increased clip length of approximately 30 minutes.
- **Pay-as-you-go API (Premium Plan):** Discrepant/Ambiguous. The initial report indicates that the Premium plan includes a "Pay-as-you-go API". This is supported by descriptions stating the Premium plan features "pay-as-you-go API" access. However, information sourced directly from Fish Audio's API billing page presents a stark contradiction, listing the TTS API price as "$0.00 / million UTF-8 bytes" and the ASR (STT) API price as "$0.00 / hour". This billing page also clarifies that API credit is separate from web playground quotas and that purchasing the premium subscription does not grant free API calls. This $0.00 pricing structure fundamentally conflicts with a pay-as-you-go model, suggesting the API might be free, part of an unlisted tier, or subject to errors in documentation. Adding to the confusion, one source mentions API access is tied to a $29.99/month Premium plan, a different price point altogether.
- **STT Offering:** Unclear. The report notes STT is "likely via API" with unclear pricing. Research confirms Fish Audio offers STT/ASR services. However, the API billing page lists the ASR price at $0.00 per hour. This zero-dollar pricing is highly unusual for STT services and requires independent verification. While the report's assessment of unclear STT pricing is confirmed, the documented $0.00 rate is a critical and potentially misleading detail.
- **Other Details:** The claim of over 200,000 voices is confirmed. Language support is mentioned, with sources listing 8 languages for Fish Speech or general multilingual support, while the report mentions 13 languages.

**Implications & Context:** The documented $0.00 pricing for both TTS and STT APIs represents a significant anomaly within the market. Standard industry practice involves usage-based fees for API access. This zero-dollar rate contradicts the "pay-as-you-go" description associated with the Premium plan. Potential explanations include outdated information in the billing documentation, a temporary promotional free tier for API usage, or a genuinely disruptive (though potentially unsustainable) pricing strategy. This ambiguity creates substantial cost uncertainty for potential API users. If the API is truly free, it represents a major competitive advantage; if not, the documentation is significantly misleading. Furthermore, the mention of different plan structures and price points ($9.99 vs. $29.99 for Premium) across sources suggests possible evolution in Fish Audio's offerings or inconsistent reporting, necessitating direct verification of current plans.

**Recommendation:** Direct verification of current API pricing models and STT service details with Fish Audio is strongly recommended due to the significant contradictions and ambiguities identified.

### 2.2 Rime AI

**Summary:** Confirmed. The pricing details provided in the report for all Rime AI TTS tiers, from the Free plan through to Enterprise options, align accurately with the information presented in the research materials. The report's statement that Rime AI does not offer STT services is also confirmed by the sources.

**Detailed Findings:**

- **TTS Only:** Confirmed. The initial report states Rime AI does not offer STT services. Supporting materials focus exclusively on TTS capabilities.
- **Free Plan ($0):** Confirmed. Includes up to 10,000 characters, API access, and over 200 voices.
- **Starter Plan ($5/month):** Confirmed. Provides up to 100,000 characters included, with additional characters priced at $65 per million.
- **Developer Plan ($15/month):** Confirmed. Offers up to 500,000 characters included, with additional characters at $60 per million. Sources note this plan was previously priced at $19/month.
- **Pro Plan ($99/month):** Confirmed. Includes up to 3 million characters, with additional characters costing $50 per million.
- **Business Plan ($249/month):** Confirmed. Provides up to 10 million characters included, $40 per million for additional characters, and includes professional voice cloning features.
- **Enterprise Plan (Custom):** Confirmed. Offers custom pricing for high-volume needs, unlimited usage, options for Virtual Private Cloud (VPC) and on-premises deployment, custom Service Level Agreements (SLAs), and professional voice cloning.
- **Startup Grants:** Confirmed. The availability of grants offering up to 3 months free for early-stage startups is mentioned. A specific program offering $5,000 in API credits for Y Combinator startups (W24 cohort onwards) is also detailed.
- **Models/Languages:** Specific models like Arcana and Mist v2 are mentioned. Multilingual capabilities are implied.

**Implications & Context:** Rime AI's pay-as-you-go rates for additional characters, ranging from $40 to $65 per million, position it competitively within the market, particularly at higher volume tiers. These rates are higher than some alternatives like AWS Polly Neural ($16/M) or Deepgram Aura-1 ($13.5-$15/M) but comparable to other premium TTS providers. An independent analysis suggests Rime's cost per minute might be higher than some ultra-low-cost options, indicating that Rime likely emphasizes voice quality, realism (described as "lifelike" and "emotionally aware"), and features like professional cloning over being the absolute lowest-cost provider. The specific mention and detailing of Startup Grants and a YC-focused credit program demonstrate a clear strategic effort to attract early-stage companies, potentially offering substantial initial cost advantages to qualifying startups.

**Recommendation:** The pricing information for Rime AI in the report appears accurate and confirmed by available sources. Businesses evaluating Rime AI should consider the Startup Grant program if applicable.

### 2.3 Cartesia

**Summary:** Mostly Confirmed, with Clarification. The pricing tiers, credit limits, and features outlined in the report for Cartesia's TTS services are largely consistent with the research materials. However, the report omitted a crucial detail regarding the definition of a 'credit,' which is clarified in the sources. The absence of STT services is confirmed.

**Detailed Findings:**

- **TTS Only:** Confirmed. The report correctly states that Cartesia does not offer STT services; research materials focus solely on TTS.
- **Free Plan ($0):** Confirmed. Includes 10,000 credits, 1 parallel request, support for 15 languages, and is restricted to personal use. An older source mentions a previous free tier with 20,000 credits and 2 requests, indicating a recent update to the offering.
- **Pro Plan ($4/month annual, $5/month monthly):** Confirmed. The report uses the annual billing price ($4/month), while sources confirm the monthly price is $5. This plan includes 100,000 credits, 3 parallel requests, instant voice cloning capabilities, and allows for commercial use.
- **Startup Plan ($41/month annual, $49/month monthly):** Confirmed. The report reflects the annual price ($41/month); sources confirm the $49 monthly rate. It includes 1.25 million credits, 5 parallel requests, and support for organizational structures.
- **Scale Plan ($249/month annual, $299/month monthly):** Confirmed. The report uses the annual price ($249/month), aligning with the $299 monthly price found in sources. This tier provides 8 million credits and 15 parallel requests. The report mentions custom SLAs and Fine-tuning for this plan; however, sources list these features under the Enterprise tier. Clarification may be needed on whether fine-tuning is available at the Scale level.
- **Enterprise Plan (Custom):** Confirmed. Offers custom credit allocations, custom parallel request limits, fine-tuning options, Single Sign-On (SSO), SOC-2/HIPAA compliance, and dedicated technical support.
- **Credit Definition:** Clarified by Sources. The initial report lacked a definition for Cartesia's credits. Research material explicitly states: "Each character of text counts as one credit". This definition is essential for accurate cost comparisons with character-based providers.
- **Languages:** Confirmed as 15 languages supported by the Sonic model. Some older comparison articles mention 13 or 7 languages, likely reflecting earlier versions.
- **Features:** The focus on the Sonic model and low latency is confirmed. Instant voice cloning requiring only 3 seconds of audio is also confirmed. Features like voice changer and localization are included in paid plans. Availability on AWS Marketplace is mentioned.

**Implications & Context:** The clarification that 1 Cartesia credit equals 1 character of text is critical for market comparison. It allows for the calculation of effective per-million-character costs: Pro plan ($5/100k credits) equates to $50/million characters; Startup plan ($49/1.25M credits) equates to $39.20/million characters; Scale plan ($299/8M credits) equates to $37.38/million characters. These rates place Cartesia in a mid-range price bracket, comparable to Rime's higher tiers but generally more expensive per character than AWS Polly Neural ($16/M) or Deepgram Aura-1 ($15/M). This suggests Cartesia competes primarily on technological advantages like its widely advertised ultra-low latency (40ms Time-to-First-Audio reported for Sonic Turbo) and voice cloning quality, rather than solely on price per character. The platform appears particularly suited for real-time applications like voice agents and gaming where responsiveness is paramount. Evidence of past pricing structures indicates the platform's pricing has evolved, with the current structure representing the most up-to-date information.

**Recommendation:** The report's information is largely accurate. It should be updated to include the definition "1 credit = 1 character" to enhance comparability. Note the distinction between annual pricing used in the report and monthly pricing confirmed in sources. Clarify if fine-tuning is available on the Scale plan or is Enterprise-only.

### 2.4 Play.ht

**Summary:** Mostly Confirmed, with Clarification. Pricing and features for Play.ht's TTS plans generally align with the research materials. However, the sources provide crucial clarification regarding the Fair Usage Policy applied to the "Unlimited" plan. The absence of STT services is confirmed. Details of the free tier show some inconsistency across sources.

**Detailed Findings:**

- **TTS Only:** Confirmed. The report correctly identifies Play.ht as a TTS-only provider; supporting materials focus on TTS capabilities.
- **Free Plan ($0):** Partially Confirmed with Discrepancy. The report states 1,000 characters per year, 1 voice clone, access to all voices, and API access. The official pricing page confirms 1,000 characters (but total, not per year), 1 instant voice clone, access to all voices/languages, high-fidelity clones, attribution-free use, and API access. However, other sources mention different free tier limits: 12,500 characters or 5,000 words per month. The 1,000-character limit from the current pricing page appears most authoritative, making the free tier very limited. The report's "per year" specification seems incorrect.
- **Creator Plan ($31.20/month annual):** Confirmed. The price matches the current official pricing page. Features include 3 million characters per year, 10 instant voice clones, attribution-free use, multilingual models, advanced audio export, high-fidelity clones, and API access. Older sources show different pricing and limits (e.g., $39/month monthly for 600k words/year or 50k words/month), indicating the current plan offers significantly more value.
- **Unlimited Plan ($49/month annual, from $99):** Confirmed. The promotional price matches the current official pricing page. It includes "Unlimited*" characters per year, unlimited instant voice clones, 3 high-fidelity clones, and API access. Older sources reflect the previous $99/month price.
- **Unlimited Plan Fair Usage Policy:** Clarified by Sources. The report notes the asterisk (*). Research materials explicitly define this: the plan is "subject to a fair usage limit of 2.5 million monthly and 30 million yearly characters". This context is vital for understanding the plan's actual limits. Another source also mentions a 2.5M character limit.
- **Enterprise Plan (Custom):** Confirmed. Offers customizable usage/cloning, team access, SSO, and commercial/resell rights. Older sources also confirm custom enterprise options.
- **Discounts:** Confirmed. Discounts for students, educators, and non-profits are available (20% flat rate mentioned), alongside discounts for annual billing.

**Implications & Context:** The most significant finding is the clarification of the "Unlimited" plan's Fair Usage Policy (FUP). While generous at 2.5 million characters monthly (30 million yearly), it is not truly unlimited. This is crucial for high-volume users comparing against genuinely unlimited tiers or higher enterprise caps elsewhere. The plan's value proposition at $49/month (annual billing) hinges on usage remaining within this FUP. Comparisons with older pricing data reveal that Play.ht has significantly increased character limits and/or reduced effective costs in its current plans. This strategic shift positions the Creator and especially the "Unlimited" plan very competitively, particularly against mid-tier offerings from competitors like ElevenLabs Pro ($99/month for ~1M characters). Play.ht appears to be targeting market share by offering high character volumes at a relatively low fixed cost (within the FUP). The inconsistency surrounding the free tier limit across sources suggests it may have been reduced over time; the current 1,000-character limit makes it suitable only for basic testing.

**Recommendation:** The report is generally accurate. Update the Free plan details to 1,000 characters (total). Critically, incorporate the specific Fair Usage Policy limits (2.5M monthly / 30M yearly) for the Unlimited plan. It may be beneficial to note the improved value proposition compared to older pricing structures found in some sources.

### 2.5 ElevenLabs

**Summary:** Confirmed. The pricing structures for both ElevenLabs' TTS (credit-based) and STT (Scribe, hour-based) services align well between the initial report and the research materials. The conversion rate between credits and minutes/characters for TTS is also corroborated.

**Detailed Findings:**

- **TTS & STT:** Confirmed. ElevenLabs provides both TTS, priced using credits, and STT via its Scribe model, priced based on hours of transcription.

**TTS Pricing (Credits):**

- **Free ($0):** Confirmed. Includes 10,000 credits per month (approximately 10 minutes of TTS or ~20,000 characters). Requires attribution.
- **Starter ($5/month):** Confirmed. Includes 30,000 credits (~30 min TTS / ~60k chars).
- **Creator ($22/month):** Confirmed. Includes 100,000 credits (~100 min TTS / ~200k chars). Additional characters cost $0.15 per 1,000. The report omitted the additional character cost.
- **Pro ($99/month):** Confirmed. Includes 500,000 credits (~500 min TTS / ~1M chars). Additional characters cost $0.12 per 1,000. The report omitted the additional character cost.
- **Scale ($330/month):** Confirmed. Includes 2 million credits (~2,000 min TTS / ~4M chars). Additional characters cost $0.09 per 1,000. The report omitted the additional character cost.
- **Business ($1,320/month):** Confirmed. Includes 11 million credits (~11,000 min TTS / ~22M chars). Additional characters cost $0.06 per 1,000. The report omitted the additional character cost.
- **Enterprise (Custom):** Confirmed. Offers custom credit allocations and SLAs.

**TTS Credit Conversion:** Confirmed. The report's assertion that 1,000 credits equate to approximately 1 minute of TTS is supported across multiple plan descriptions in the research. Character equivalents provided suggest an average of roughly 2 characters per credit.

**STT (Scribe) Pricing (Hours):**

- **Free ($0):** Confirmed. STT functionality is unavailable in the free tier. The report incorrectly implied STT availability on the free plan.
- **Starter ($5/month):** Confirmed. Includes 12.5 hours (12 hours 30 minutes) of STT. No option to purchase additional hours.
- **Creator ($22/month):** Confirmed. Includes 62.85 hours (62 hours 51 minutes) of STT. Additional hours cost $0.48 each.
- **Pro ($99/month):** Confirmed. Includes 300 hours of STT. Additional hours cost $0.40 each.
- **Scale ($330/month):** Confirmed. Includes 1,100 hours of STT. Additional hours cost $0.33 each.
- **Business ($1,320/month):** Confirmed. Includes 6,000 hours of STT. Additional hours cost $0.22 each.
- **Enterprise (Custom):** Confirmed. Offers custom STT hour allocations and SLAs.

**STT (Scribe) Features:** Confirmed support for 99 languages and claims of high accuracy. Benchmarks suggest strong performance relative to competitors like OpenAI's models. Plan-specific concurrency limits are confirmed. Features like word-level timestamps and speaker diarization are mentioned. Some limitations noted include being closed-source, potential sensitivity to audio quality, and certain API restrictions (e.g., file stream input only, <8 min audio for diarization via API).

**Voice Cloning:** Confirmed. Instant Voice Cloning is available from the Starter plan upwards, while Professional Voice Cloning is included from the Creator plan onwards.

**Audio Quality:** Confirmed. Higher audio quality (192kbps) is available from the Creator plan, and PCM audio output via API is available from the Pro plan.

**Implications & Context:** A key aspect of ElevenLabs' strategy is bundling substantial STT (Scribe) hours with its TTS credit plans starting from the Starter tier. This creates a compelling value proposition for users requiring both TTS and STT capabilities, potentially simplifying vendor management and offering cost efficiencies compared to acquiring these services separately from providers like AWS or Deepgram. The use of a credit-based system for TTS allows ElevenLabs flexibility in pricing different models or features; for instance, lower-latency models might consume fewer credits per minute than higher-quality ones, offering more granularity than fixed character-based pricing. Users should monitor credit consumption based on the specific features utilized. Scribe's STT pricing, both the effective cost per hour within plans ($0.22-$0.40/hr) and the cost for additional hours ($0.22-$0.48/hr), is competitive with other premium STT services like Deepgram Nova-3 or AssemblyAI, especially given the high accuracy claims and broad language support. The bundling with TTS credits further enhances its attractiveness for users needing an integrated voice AI platform.

**Recommendation:** The report's information is largely accurate. It should be updated to include the cost per additional TTS character for paid plans and explicitly state that STT (Scribe) is unavailable on the Free tier.

### 2.6 Deepgram

**Summary:** Confirmed. The pricing details for Deepgram's STT (specifically Nova-3 models) and TTS (Aura-1 and the newer Aura-2) services align accurately with the information found in the research materials. The plan structure (Pay As You Go, Growth, Enterprise) and the availability of free credits are also confirmed.

**Detailed Findings:**

- **TTS & STT:** Confirmed. Deepgram offers both STT and TTS services.
- **Plan Structure:** Confirmed. The three main tiers are Pay As You Go (PAYG), Growth (requiring an annual commitment of $4k+), and Enterprise ($15k+/year).
- **STT Pricing (Nova-3 English):** Confirmed. PAYG rate is $0.0043 per minute. Growth rate is $0.0036 per minute. Older models like Nova-1/2 were previously offered at similar rates. Deepgram also offers OpenAI's Whisper Large model via its API at $0.0048 per minute for both PAYG and Growth tiers.
- **STT Pricing (Nova-3 Multilingual):** Confirmed. PAYG rate is $0.0052 per minute. Growth rate is $0.0043 per minute.
- **TTS Pricing (Aura-1):** Confirmed. PAYG rate is $0.0150 per 1,000 characters. Growth rate is $0.0135 per 1,000 characters. The PAYG rate is also mentioned elsewhere.
- **TTS Pricing (Aura-2):** Confirmed (though not in the original report, present in sources). PAYG rate is $0.030 per 1,000 characters. Growth rate is $0.027 per 1,000 characters. Aura-2 is positioned as a more professional, higher-quality option compared to alternatives.
- **Enterprise Pricing:** Confirmed as Custom. Requires contacting sales for tailored pricing for both STT and TTS, often including volume discounts and access to custom models.
- **Free Credit:** Confirmed. Deepgram provides $200 in free credits for new users on the PAYG plan.
- **Concurrency Limits:** Confirmed. The report mentions limits, and sources provide specifics: e.g., STT pre-recorded allows up to 100 concurrent requests, TTS Aura Batch API allows 2-3 concurrent requests (PAYG/Growth), and TTS Aura WebSocket API allows 40 concurrent connections. Enterprise plans offer the highest concurrency.
- **Add-ons:** Confirmed. Features like Redaction incur additional costs ($0.0017-$0.0020 per minute). Other add-ons like Entity Detection and Keyterm Prompting also have separate charges.
- **Model Improvement Program:** Confirmed. The standard listed rates require opting into data usage for model improvement. Opt-out rates are not specified but are typically higher.

**Implications & Context:** Deepgram positions itself very competitively on price. Its Nova-3 English STT rate on the Growth plan ($0.0036/min or $0.216/hr) is among the lowest for high-accuracy models, undercutting standard rates from AWS Transcribe and Google Cloud Speech-to-Text significantly. Similarly, its hosted Whisper Large offering ($0.0048/min) is competitive against OpenAI's direct API rate ($0.006/min). For TTS, the Aura-1 model ($0.0135-$0.015/1k chars) is also highly competitive against comparable quality tiers like AWS Polly Neural ($16/M chars) or higher-priced options from Rime/Cartesia. This suggests Deepgram aims for price leadership in both STT and TTS markets, particularly for users who can commit to the Growth tier. The offering of both proprietary Nova models and Whisper Large provides flexibility, though Nova-3 is priced slightly lower and heavily promoted for its accuracy, suggesting it's the preferred flagship product. The introduction of Aura-2 TTS at double the price of Aura-1 indicates a tiered quality strategy, with Aura-1 serving cost-sensitive needs and Aura-2 targeting premium voice requirements.

**Recommendation:** The report's information is accurate. It would be beneficial to add the pricing details for the Aura-2 TTS model and explicitly mention the pricing for Deepgram's hosted Whisper Large STT option as an alternative to Nova-3.

### 2.7 Hume AI

**Summary:** Confirmed, with Clarification. Pricing details for Hume AI's Octave TTS plans, the Empathic Voice Interface (EVI), and the Expression Measurement API are accurately reflected in the research materials. It requires clarification that STT functionality is bundled within the EVI and Expression Measurement APIs, not offered as a standalone service.

**Detailed Findings:**

- **TTS Offering (Octave):** Confirmed. A range of plans from Free to Enterprise exists for the Octave TTS service.
- **Free ($0):** Confirmed. Includes 10,000 characters per month (~10 minutes).
- **Starter ($3/month):** Confirmed. Includes 30,000 characters (~30 minutes) and a commercial license.
- **Creator ($10/month):** Confirmed. Includes 100,000 characters (~100 minutes), with additional characters at $0.20 per 1,000.
- **Pro ($50/month):** Confirmed. Includes 500,000 characters (~500 minutes), with additional characters at $0.15 per 1,000.
- **Scale ($150/month):** Confirmed. Includes 2 million characters (~2,000 minutes), with additional characters at $0.13 per 1,000.
- **Business ($900/month):** Confirmed. Includes 10 million characters (~10,000 minutes), with additional characters at $0.10 per 1,000.
- **Enterprise (Custom):** Confirmed. Offers custom character limits, pricing, and SLAs.
- **STT Offering:** Clarification Needed. The report correctly suggests STT is likely part of other APIs and not standalone. Research confirms that the Expression Measurement API (Audio only option) at $0.0213 per minute explicitly includes transcription. Similarly, the Empathic Voice Interface (EVI) includes transcription as part of its functionality and per-minute cost. No standalone STT service is mentioned. Therefore, STT is available only as a bundled component.
- **Empathic Voice Interface (EVI):** Confirmed. EVI 1 (Legacy) is priced at $0.102 per minute, while the current EVI 2 is $0.072 per minute. EVI integrates STT, language modeling (Hume LLM or external), and expressive TTS generation.
- **Expression Measurement API:** Confirmed. The "Audio only" modality costs $0.0213 per minute and includes transcription along with analysis of speech prosody, vocal bursts, and emotional language. Other modalities (video, image, text) are priced differently.
- **Free Credit:** Confirmed. A $20 free credit is offered for pay-as-you-go usage of the APIs.

**Implications & Context:** Hume AI's primary market differentiation lies in providing emotionally intelligent AI capabilities, evident in its EVI and Expression Measurement API products. TTS (Octave) and STT serve as enabling components within this broader focus on empathy and expression analysis, rather than being offered as standalone commodity services. The pricing reflects this value-add; for example, EVI at $0.072/minute is substantially higher than the combined cost of basic STT and TTS from many competitors, indicating a premium charged for the integrated emotional intelligence layer. This suggests Hume AI targets applications where nuanced understanding and generation of emotion are critical, such as AI coaching, wellness applications, or advanced customer service agents. While STT is included in the Expression Measurement API (Audio) at $0.0213/minute, this rate is significantly higher than dedicated STT services like Deepgram Nova-3 or AssemblyAI Nano. This reinforces that the price covers the bundled analysis (prosody, emotion, etc.) alongside transcription, making it uncompetitive for users needing only basic STT. The Octave TTS pricing tiers show significant scaling benefits, with per-character costs decreasing at higher volumes. However, even at the highest tiers, the cost per million characters ($100-$200/M) remains premium compared to many alternatives, likely justified by voice quality, customization features ("unlimited custom voices"), or integration within Hume's emotion-centric ecosystem.

**Recommendation:** The report's information is accurate. It should be explicitly stated that STT is available only as a bundled component within the Expression Measurement API or the Empathic Voice Interface (EVI), and not as a standalone offering.

### 2.8 AWS Polly (TTS)

**Summary:** Confirmed. The pricing details reported for Amazon Polly's various TTS voice types (Standard, Neural, Generative, Long-Form) and the free tier structure align accurately with the information found in the research materials.

**Detailed Findings:**

- **TTS Only:** Confirmed. Amazon Polly is AWS's dedicated TTS service.
- **Pricing Model:** Confirmed as a pay-as-you-go model based on the number of characters converted to speech or Speech Marks.
- **Standard Voices:** Confirmed pricing at $4.00 per million characters. Pricing is higher in AWS GovCloud regions ($4.80/M).
- **Neural Voices:** Confirmed pricing at $16.00 per million characters. GovCloud pricing is higher ($19.20/M).
- **Generative Voices:** Confirmed pricing at $30.00 per million characters.
- **Long-Form Voices:** Confirmed pricing at $100.00 per million characters.
- **Free Tier:** Confirmed. Valid for the first 12 months after signup. Allowances vary by voice type: Standard includes 5 million characters per month; Neural includes 1 million characters per month; Long-Form includes 500,000 characters per month; Generative includes 100,000 characters per month. The report correctly listed Standard, Neural, and Generative limits but missed the Long-Form free tier allowance.
- **Speech Marks:** Confirmed. Usage is charged at the same per-character rate as the corresponding voice type used for speech synthesis.
- **Caching/Replay:** Confirmed. Users can cache and replay generated audio output without incurring additional charges from Polly.

**Implications & Context:** Amazon Polly offers distinct tiers of voice quality and features (Standard, Neural, Generative, Long-Form) at significantly different price points ($4, $16, $30, $100 per million characters, respectively). This structure allows users to select a voice type based on their specific needs and budget, but costs escalate substantially for higher-quality or specialized voices like Long-Form. The Neural voice tier ($16/M) often serves as a benchmark for good quality AI speech and is priced competitively against some alternatives like Deepgram Aura-1 ($15/M) but is considerably cheaper than premium tiers from providers like ElevenLabs. The straightforward pricing model based purely on characters processed offers simplicity and predictability compared to credit-based or bundled plans from other vendors. The free tier structure, with different character allowances for each voice type, allows experimentation but means free usage is consumed more quickly when utilizing the higher-cost, higher-quality voices.

**Recommendation:** The report is accurate. It should be updated to include the free tier allowance for Long-Form voices (500,000 characters per month) based on the research materials.

### 2.9 AWS Transcribe (STT)

**Summary:** Confirmed. The pricing details for standard Amazon Transcribe STT services (batch and streaming) align with the information provided in the research materials. The free tier details and the existence of regional pricing variations are also confirmed.

**Detailed Findings:**

- **STT Only:** Confirmed. Amazon Transcribe is AWS's dedicated STT service.
- **Pricing Model:** Confirmed as a pay-as-you-go model based on the duration (in seconds) of audio transcribed, billed monthly. Billing occurs in one-second increments, subject to a minimum charge of 15 seconds per request.
- **Standard Transcription Pricing:** Confirmed. Using the US East (N. Virginia) region as an example, the price starts at $0.024 per minute ($0.0004 per second) for the first 250,000 minutes transcribed per month. Volume-based tiers reduce this rate significantly for higher usage.
- **Free Tier:** Confirmed. Includes 60 minutes of transcription per month for the first 12 months after creating the first transcription request.
- **Regional Pricing:** Confirmed. Pricing varies depending on the AWS Region where the service is used. Specific pricing for China regions is also documented.
- **Features Included/Add-ons:** Standard pricing includes features like PII redaction, custom vocabularies, and vocabulary filtering. Speaker diarization and multi-channel audio processing are supported. Toxicity detection is offered at the same tiered rates as standard batch transcription.
- **Medical Transcription:** Confirmed. Amazon Transcribe Medical is available as a separate service with distinct, higher pricing (starting at $0.075 per minute).

**Implications & Context:** Amazon Transcribe's standard starting price ($0.024/min or $1.44/hr) is positioned relatively high compared to several prominent competitors in the STT market, such as Deepgram Nova-3 ($0.0043/min), AssemblyAI Universal ($0.0062/min), or hosted Whisper API options ($0.0048-$0.006/min). This suggests AWS may rely on factors like integration within its broader cloud ecosystem, brand reputation, enterprise features (e.g., robust PII redaction, Call Analytics capabilities), and significant volume discounts to justify this premium. The tiered pricing structure does offer substantial cost reductions at very high volumes (down to $0.0078/min over 5 million minutes/month), making it potentially more competitive for large enterprise customers already heavily invested in AWS. The billing increment (per second with a 15-second minimum) is a standard industry practice but could impact the effective cost for applications processing numerous very short audio files.

**Recommendation:** The report's information is accurate. It would be beneficial to highlight the relatively high starting price compared to key competitors while also noting the potential for significant cost reduction through volume discounts.

### 2.10 AssemblyAI

**Summary:** Confirmed. The pricing details provided for AssemblyAI's STT models (Nano, Slam-1/Universal, Streaming) and the free tier offering align accurately with the research materials. The absence of TTS services is also confirmed.

**Detailed Findings:**

- **STT Only:** Confirmed. The report correctly states AssemblyAI does not offer TTS; research focuses on STT and related Audio Intelligence features.
- **Free Plan:** Confirmed. Provides $50 in free credits upon signup. Sources indicate this can transcribe up to 416 hours of audio, implying usage of the lowest-cost Nano model ($0.12/hr). The free tier supports the Nano, Universal, and Slam-1 models.
- **Pay As You Go (Prerecorded):** Confirmed.
  - Nano Model: $0.12 per hour ($0.002 per minute).
  - Slam-1 / Universal Models: $0.37 per hour ($0.0062 per minute). This rate is also confirmed elsewhere. An older source incorrectly cited $0.12/hr, likely referring only to the Nano model.
- **Pay As You Go (Streaming):** Confirmed. Priced at $0.47 per hour ($0.0078 per minute). This rate is also confirmed elsewhere. Sources note this price was reduced from a previous rate of $0.75 per hour.
- **Custom Plan:** Confirmed. Requires contacting sales, offers volume discounts, and includes AWS Marketplace integration.
- **Audio Intelligence:** Confirmed. AssemblyAI offers various add-on features like Entity Detection, Topic Detection, PII Redaction, Summarization, etc., which are priced separately per hour.
- **Model Differentiation:** Confirmed. Nano is positioned for speed, cost-effectiveness, and broad language support (99 languages). Universal is a high-accuracy English model for general use. Slam-1 is presented as the most advanced English model with customization via prompting for specialized domains. Universal-2 is mentioned as a newer, highly accurate model.
- **Accuracy:** Confirmed. AssemblyAI emphasizes high accuracy across its models. Independent benchmarks place their Universal-2 model among the top performers in terms of Word Error Rate (WER).

**Implications & Context:** AssemblyAI provides flexibility through its tiered STT models (Nano, Universal, Slam-1) offered at distinct price points ($0.12/hr and $0.37/hr). This allows users to balance cost and speed (Nano) against accuracy and advanced features (Universal/Slam-1). The pricing is highly competitive; the Universal/Slam-1 rate ($0.37/hr) rivals the OpenAI Whisper API ($0.36/hr) and is substantially lower than standard rates from AWS Transcribe or Google Cloud Speech-to-Text. The Nano model ($0.12/hr) offers an extremely low-cost option, competitive even with self-hosted open-source solutions when factoring in operational overhead. The streaming rate ($0.47/hr) is also competitive against alternatives like Deepgram's Nova-3 streaming. Beyond core STT, AssemblyAI heavily promotes its developer experience (SDKs, documentation) and its suite of Audio Intelligence features (summarization, PII redaction, topic detection, etc.) and the LeMUR framework for building LLM applications on audio data. This suggests a strategy focused not just on transcription accuracy and cost, but also on providing a comprehensive platform for extracting value and insights from spoken data.

**Recommendation:** The report's information is accurate. Including the price per minute ($0.002/min for Nano, $0.0062/min for Universal/Slam-1, $0.0078/min for Streaming) could facilitate easier comparisons.

### 2.11 Gladia

**Summary:** Confirmed. The pricing details for Gladia's Free and Pro STT plans (including distinct rates for batch and live transcription) align with the information presented in the research materials. The absence of TTS services is also confirmed.

**Detailed Findings:**

- **STT Only:** Confirmed. The report correctly identifies Gladia as an STT-focused provider; research materials discuss STT and Audio Intelligence capabilities.
- **Free Plan ($0):** Confirmed. Offers 10 hours of transcription per month and includes a concurrency limitation.
- **Pro Plan:** Confirmed. Batch transcription is priced at $0.612 per hour ($0.0102 per minute). Live (real-time) transcription incurs an additional charge of $0.144 per hour ($0.0024 per minute), making the total live cost $0.756 per hour. The plan supports over 100 languages and real-time processing. One source mentions pricing at $0.00017 per second (which equals $0.612/hr) for their optimized Whisper model, corroborating the batch rate.
- **Enterprise Plan (Custom):** Confirmed. Offers custom SLAs, potential for on-premise deployment, and dedicated support, requiring contact with sales for pricing.
- **Features:** Confirmed. Gladia's technology is based on an optimized version of OpenAI's Whisper model (referred to as Whisper-Zero). Claims high accuracy, supports over 100 languages, includes speaker diarization, and handles code-switching (mixing languages within speech). Real-time transcription offers low latency (reported <300ms).

**Implications & Context:** Gladia's market positioning appears centered on providing an enhanced, enterprise-ready version of the popular open-source Whisper STT model. They aim to deliver improved reliability, broader language support, and additional features like code-switching compared to standard Whisper implementations. The Pro plan's pricing structure distinguishes between batch processing ($0.612/hr) and live processing ($0.756/hr total), reflecting the different resource demands of real-time transcription. While the batch rate is moderately competitive, both batch and live rates are higher than some alternatives like AssemblyAI or Deepgram Nova-3. Gladia likely justifies this premium through its specific Whisper optimizations, extensive language coverage (100+), and advanced features targeting multilingual or complex audio scenarios. The free tier, offering 10 hours of transcription per month, is notably generous compared to many competitors' free offerings, allowing for substantial testing and potentially supporting small-scale projects without cost.

**Recommendation:** The report's information is accurate and confirmed by the research materials.

### 2.12 LMNT

**Summary:** Confirmed. The pricing details for LMNT's TTS plans (Indie, Pro, Premium) and the existence of a free Playground tier align accurately with the research materials. The absence of STT services is also confirmed.

**Detailed Findings:**

- **TTS Only:** Confirmed. The report correctly identifies LMNT as a TTS provider; sources focus on TTS capabilities.
- **Free Playground Tier:** Confirmed. LMNT offers a free Playground for testing. Additionally, a Free API tier exists, providing 15,000 characters included and unlimited voice clones.
- **Indie Plan ($10/month):** Confirmed. Includes 200,000 characters, with additional characters priced at $0.05 per 1,000. Features include unlimited voice clones and a commercial use license.
- **Pro Plan ($49/month):** Confirmed. Includes 1.25 million characters, with additional characters at $0.045 per 1,000.
- **Premium Plan ($199/month):** Confirmed. Includes 5.7 million characters, with additional characters at $0.035 per 1,000.
- **Features:** Confirmed focus on low-latency applications (reporting <300ms latency). Voice cloning from just 5 seconds of audio is supported. Developer SDKs (Python, Node) are available.

**Implications & Context:** LMNT's pricing structure appears competitive, particularly in its mid-range tiers. The Indie ($10/mo for 200k chars + $50/M overage) and Pro ($49/mo for 1.25M chars + $45/M overage) plans offer substantial character volumes at rates that compare favorably with equivalent tiers from providers like Rime or Cartesia. This positions LMNT as a strong value proposition for developers requiring significant TTS usage without needing enterprise-level commitments. Similar to Cartesia, LMNT emphasizes low latency (<300ms streaming) and provides developer-focused tools like SDKs. This suggests LMNT targets developers building real-time voice applications, such as conversational AI agents or interactive gaming experiences, using competitive pricing and performance as key differentiators.

**Recommendation:** The report's information is accurate and confirmed by the research materials.

### 2.13 Neuphonic

**Summary:** Confirmed as Unclear/Contact Sales. Research confirms Neuphonic offers a free trial for its TTS service, but public pricing details are not readily available, necessitating direct contact with their sales team. The service's key highlighted feature is its ultra-low latency. No evidence of STT services was found.

**Detailed Findings:**

- **TTS Offering:** Confirmed. Neuphonic specializes in ultra-low latency TTS.
- **Pricing:** Confirmed as requiring contact with sales. The initial report stated no public pricing was found. Research materials include links to "Pricing" or "Contact Sales" but do not list specific price points. One source mentions "Paid version from $15.00 /month", but this appears in the context of comparing Neuphonic to an unrelated social media tool (Zoho Social) and likely does not refer to Neuphonic's pricing. Another comparison article also omits Neuphonic's pricing. Funding information (€3.5M) is mentioned, but not pricing.
- **Free Trial:** Confirmed. The report mentions a free trial is available. Multiple sources explicitly offer users to "Get Started For Free".
- **Key Feature (Latency):** Confirmed. Ultra-low latency, specifically under 25 milliseconds, is repeatedly highlighted as a core feature.
- **STT Offering:** Not Found. All available information focuses exclusively on TTS and voice generation capabilities.

**Implications & Context:** The absence of publicly listed pricing is a common strategy for companies focusing on enterprise clients or offering highly customized solutions. Pricing in such cases is typically negotiated based on specific usage volumes, required features, deployment models (Neuphonic mentions on-device solutions), and Service Level Agreements (SLAs). The strong emphasis on extreme low latency (<25ms) further suggests Neuphonic targets high-performance, potentially niche applications where this speed is a critical requirement and can command premium pricing.

**Recommendation:** The report's assessment that pricing requires contacting sales is accurate and confirmed by the lack of public pricing information in the research materials.

### 2.14 Piper TTS

**Summary:** Confirmed. Piper TTS is correctly identified as an open-source TTS system that is free to use if self-hosted. No evidence of a commercially hosted service or associated pricing was found.

**Detailed Findings:**

- **TTS Offering:** Confirmed. Piper is described as a fast, local neural text-to-speech system.
- **Pricing:** Confirmed as free for self-hosted use. The report's statement aligns with sources indicating Piper is open-source software available on GitHub, implying no cost beyond potential hardware and operational expenses for self-hosting. No hosted pricing is mentioned.
- **Source:** Confirmed as open-source software, with its primary repository hosted on GitHub. It utilizes the VITS model architecture and runs using onnxruntime.
- **Features:** Piper is designed for fast, local execution, making it suitable for applications where privacy or offline operation is important. It supports numerous languages and voices and is noted for integration with platforms like Home Assistant.
- **STT Offering:** Not Found. Piper is specifically a TTS system.

**Implications & Context:** Piper TTS stands out as a viable, high-quality, and completely free alternative to commercial TTS services for users possessing the technical expertise to download, configure, and manage the software themselves. Its local nature addresses potential data privacy concerns associated with cloud-based APIs. For the broader market, Piper serves as an important benchmark; commercial TTS providers must demonstrate value beyond Piper's capabilities (e.g., through ease of use, broader voice selection, unique features, dedicated support, or superior quality) to justify their costs.

**Recommendation:** The report's information is accurate and confirmed by the research materials.

### 2.15 NVIDIA Riva

**Summary:** Confirmed as Unclear/Contact Sales for Enterprise Use. Research confirms NVIDIA Riva offers both TTS and STT capabilities. While free access is available for trial and prototyping purposes, production deployment requires licensing through the NVIDIA AI Enterprise software suite, for which public pricing is not readily available.

**Detailed Findings:**

- **TTS & STT:** Confirmed. Riva provides GPU-accelerated microservices for Automatic Speech Recognition (ASR/STT), Text-to-Speech (TTS), and Neural Machine Translation (NMT).
- **Pricing:** Confirmed as requiring contact/licensing for enterprise/production use. The report correctly states no public pricing for hosted services was found. Sources indicate that while Riva can be explored for free via NVIDIA's API catalog and a 90-day free trial license for NVIDIA AI Enterprise is offered, deployment in production environments necessitates obtaining a license for the NVIDIA AI Enterprise software suite. Forum discussions highlight user confusion regarding free access versus potential costs, such as high hourly rates on AWS Marketplace ($60/hr mentioned), reinforcing the lack of simple, public pay-as-you-go pricing. Development and evaluation usage is stated to be free, but production requires the license.
- **Features:** Riva emphasizes GPU acceleration, real-time performance, customization capabilities, and multilingual support.

**Implications & Context:** NVIDIA Riva is positioned as an enterprise-grade solution, deeply integrated within the NVIDIA AI Enterprise ecosystem. Its pricing model is tied to this software suite rather than offering standalone, publicly listed per-minute or per-character rates common among other API providers. This strategy targets organizations that require high-performance, scalable voice AI solutions, potentially leveraging existing NVIDIA hardware and software investments. The emphasis on GPU acceleration and real-time capabilities suggests Riva is optimized for demanding applications where low latency and high throughput are critical, justifying an enterprise licensing model over competing directly with lower-cost commodity APIs.

**Recommendation:** The report's assessment that enterprise pricing requires contacting NVIDIA is accurate. It should also note the availability of free access for trial and development purposes via the API catalog and the 90-day NVIDIA AI Enterprise trial license.

### 2.16 Ultravox

**Summary:** Partially Confirmed/Clarified. The initial report suggested Ultravox likely offers STT with unknown details. Research reveals Ultravox provides integrated AI voice agents, leveraging an open-weight Speech Language Model (SLM), priced per minute of interaction. This includes STT and TTS functionalities as part of the agent.

**Detailed Findings:**

- **Service Offering:** Clarified. Ultravox offers AI voice agents built upon an SLM that processes speech directly, rather than just standalone STT. This integrated approach inherently combines STT, language understanding/generation, and TTS within a single framework.
- **Pricing:** Clarified. The service is priced at $0.05 per minute for the real-time voice agent interaction. A free tier is available for initial use.
- **Technology:** Ultravox utilizes an open-weight SLM designed to understand speech naturally. It supports multilingual communication, integration via SDKs (including Twilio support), and allows users to bring their own models (BYOM). Performance benchmarks against models like GPT-4o are provided.

**Implications & Context:** Ultravox employs a distinct pricing model compared to most providers in this report. The $0.05 per minute rate covers the entire voice agent interaction loop (listening/STT, thinking/LLM, speaking/TTS), not just an isolated STT or TTS task. This pricing is comparable to Hume AI's EVI ($0.072/min) but potentially offers a more cost-effective solution for building conversational agents compared to integrating separate, potentially premium, STT, LLM, and TTS services from different vendors. The claim of processing speech directly via an SLM without intermediate text conversion represents a significant architectural difference from traditional cascaded systems. If effective, this approach could offer advantages in terms of lower latency and more natural, expressive conversational flow, positioning Ultravox as an innovator in the voice agent space.

**Recommendation:** The report should be updated to reflect that Ultravox provides integrated AI voice agents (incorporating STT and TTS via an SLM) priced at $0.05 per minute, rather than just potentially offering standalone STT.

### 2.17 Whisper

**Summary:** Confirmed. Whisper is correctly identified as an open-source STT model developed by OpenAI, available free for self-hosting. Hosted API access is available through various third-party providers at different price points.

**Detailed Findings:**

- **STT Offering:** Confirmed. Whisper is a widely recognized open-source STT model from OpenAI.
- **Pricing (Self-Hosted):** Confirmed as free, excluding the costs of hardware and operational management required for self-hosting.
- **Pricing (Hosted API):** Confirmed. Whisper is available via APIs from multiple providers. Examples include OpenAI's own API ($0.006/minute), Deepgram's hosted Whisper Large ($0.0048/minute), and WhisperAPI.com ($0.15/hour or $0.0025/minute). The original report incorrectly cited Deepgram's Nova-3 price as a Whisper hosting example.
- **Source:** Confirmed as open-source software with code available on GitHub. Multiple model sizes (tiny, base, small, medium, large, turbo) and versions (v2, v3) exist, offering trade-offs between speed, accuracy, and resource requirements.
- **Features:** Whisper supports multilingual speech recognition, speech translation into English, and language identification. Its accuracy is generally considered high but varies by language and model size.
- **TTS Offering:** Not Applicable. Whisper is solely an STT model.

**Implications & Context:** Whisper's release as a high-performing open-source model has significantly impacted the STT market, establishing a benchmark for accuracy and multilingual capabilities. Many commercial STT providers now compare their proprietary models against Whisper or offer hosted Whisper API access as part of their portfolio. This provides users with a spectrum of cost options, from free self-hosting (requiring technical expertise and infrastructure) to various paid API offerings that provide convenience, reliability, and potentially additional features. The availability of low-cost Whisper APIs puts competitive pressure on providers with higher STT pricing.

**Recommendation:** The report's description of Whisper as open-source STT is accurate. Correct the example of hosted pricing: Deepgram offers Whisper Large at $0.0048/min, and OpenAI provides its API at $0.006/min.

### 2.18 XTTS (Coqui)

**Summary:** Confirmed. XTTS is correctly identified as an open-source TTS model, strongly associated with the now-defunct Coqui.ai, and is free if self-hosted. No commercially hosted pricing was found.

**Detailed Findings:**

- **TTS Offering:** Confirmed. XTTS is an open-source TTS model. It was developed by and powered the services of Coqui.ai.
- **Pricing:** Confirmed as free for self-hosted use. While Coqui previously offered commercial Studio and API services based on XTTS, the company has ceased operations. The model itself remains available as open-source. No current hosted pricing exists.
- **Source:** Confirmed as open-source. Originally hosted on Coqui's GitHub, the model and code persist in forks and on platforms like Hugging Face. It is based on the Tortoise TTS architecture.
- **Features:** XTTS is known for high-quality voice cloning from very short audio samples (3-6 seconds), including cross-lingual voice cloning. It supports multilingual speech generation (17 languages in version 2) and offers streaming capabilities.
- **STT Offering:** Not Found. XTTS is specifically a TTS model.

**Implications & Context:** XTTS represents a powerful open-source alternative in the TTS space, offering advanced features like few-shot voice cloning and cross-lingual synthesis that are often found only in premium commercial services. Its availability forces commercial TTS providers, especially those competing on cloning or multilingual features (e.g., ElevenLabs, Play.ht), to demonstrate significant advantages in ease of use, reliability, scalability, voice variety, or further quality improvements to justify their costs for users capable of self-hosting XTTS.

**Recommendation:** The report's information is accurate. It may be useful to note the model's origin with Coqui.ai and its persistence as open-source despite the company's closure.

### 2.19 M4T Seamless (Meta)

**Summary:** Confirmed. SeamlessM4T is correctly identified as an open-source multimodal AI model from Meta AI, supporting STT, TTS, and translation tasks. It is free for self-hosting but released under a research license that restricts commercial use. No commercially hosted pricing was found.

**Detailed Findings:**

- **TTS & STT Offering:** Confirmed. SeamlessM4T is a single model designed for multiple tasks, including Automatic Speech Recognition (ASR/STT), Text-to-Speech (TTS), Speech-to-Speech Translation (S2ST), Speech-to-Text Translation (S2TT), Text-to-Speech Translation (T2ST), and Text-to-Text Translation (T2TT).
- **Pricing:** Confirmed as free for self-hosted use. However, it is released under a Creative Commons Attribution-NonCommercial 4.0 International (CC-BY-NC 4.0) license, which prohibits direct commercial use without potentially separate arrangements with Meta. No evidence of a commercially hosted version or pricing was found. A demo is available on Hugging Face, but duplicating it may incur hosting costs.
- **Source:** Confirmed as an open-source project from Meta AI. Code and models are available via GitHub and Hugging Face. It builds upon Meta's previous work like NLLB and Massively Multilingual Speech. An updated version, SeamlessM4T v2, utilizes the UnitY2 architecture for improved quality and speed.
- **Features:** SeamlessM4T provides massively multilingual support (up to 100 languages depending on the specific task) and operates across modalities (speech and text). Its unified model architecture aims to improve quality and reduce latency compared to traditional cascaded systems. Variants like SeamlessExpressive focus on preserving prosody, while SeamlessStreaming enables real-time translation.

**Implications & Context:** SeamlessM4T is a significant contribution to the open-source AI landscape, offering a powerful, unified model for a wide range of speech and text translation tasks across numerous languages. It challenges commercial providers by offering a free (though non-commercially licensed) foundation for building sophisticated multilingual communication tools. However, the CC-BY-NC 4.0 license restricts its direct incorporation into paid products or services, limiting its immediate competitive impact on the commercial market compared to permissively licensed models like Piper or Whisper. Its primary influence may be indirect, pushing research boundaries and potentially shaping the features and capabilities offered by commercial vendors.

**Recommendation:** The report's information is accurate. It is crucial to add the detail regarding the non-commercial (CC-BY-NC 4.0) license under which the model is released, as this significantly affects its usability for commercial applications.

## 3. Summary of Key Findings

The verification process yielded several key findings regarding the accuracy and completeness of the "Detailed Pricing Report for TTS and STT Services":

**General Accuracy:** For providers with clearly documented public pricing (Rime AI, Cartesia, Play.ht, ElevenLabs, Deepgram, Hume AI, AWS Polly, AWS Transcribe, AssemblyAI, Gladia, LMNT), the report was largely accurate in terms of plan names, base costs, and core features. Minor discrepancies often related to recent pricing updates or specific details like free tier allowances or add-on costs.

**Significant Discrepancies/Ambiguities:**

- **Fish Audio API:** A major contradiction exists between the report's mention of a "pay-as-you-go" API and source documentation listing $0.00/million characters (TTS) and $0.00/hour (STT) rates. This requires urgent clarification.
- **Play.ht "Unlimited" Plan:** The report lacked context on the Fair Usage Policy (2.5M monthly / 30M yearly characters) associated with this plan, a critical detail for potential high-volume users.
- **Cartesia Credits:** The report omitted the definition that 1 credit equals 1 character, hindering direct price comparisons.

**Service Offering Clarifications:**

- **Ultravox:** Identified not as just STT, but as an integrated AI voice agent service (SLM) priced per minute of interaction.
- **Hume AI STT:** Confirmed that STT is available only as a bundled component within the Expression Measurement API or EVI, not standalone.

**Providers Lacking Public Pricing:** The report accurately identified Neuphonic and NVIDIA Riva as requiring direct contact for enterprise/production pricing. Research confirmed free trial/development access is available for both.

**Open Source Models:** The report correctly identified Piper TTS, XTTS (Coqui), Whisper (OpenAI), and M4T Seamless (Meta) as open-source models, free for self-hosting. Key context added includes Whisper's availability via hosted APIs and M4T Seamless's non-commercial license.

**Pricing Competitiveness:** Verification allowed for contextualizing prices. Deepgram and AssemblyAI appear highly competitive on STT pricing. AWS Transcribe's standard tier is relatively expensive compared to many competitors. Play.ht's current "Unlimited" plan offers high volume at a competitive fixed price (within FUP). Providers like Rime, Cartesia, LMNT, and Hume AI often compete on features (latency, cloning, emotion) rather than solely on lowest cost per character/minute. ElevenLabs offers strong value through bundled TTS credits and STT hours.

## 4. Recommendations

Based on the verification analysis, the following recommendations are provided:

**Exercise Caution with Discrepant Data:** Information identified as discrepant or ambiguous, particularly the API pricing for Fish Audio, should be treated with extreme caution. Relying on this data without further validation could lead to significant miscalculations in budgeting or competitive assessment.

**Incorporate Clarifications:** Update internal datasets or reports to include the critical clarifications identified:

- Define Cartesia credits as 1 credit = 1 character.
- Specify the Fair Usage Policy limits (2.5M monthly / 30M yearly characters) for Play.ht's Unlimited plan.
- Note that Hume AI's STT is bundled within its Expression Measurement or EVI APIs, not standalone.
- Update Ultravox's offering to integrated voice agents at $0.05/min.
- Correct the hosted Whisper API pricing examples (e.g., Deepgram at $0.0048/min, OpenAI at $0.006/min).
- Add the non-commercial license restriction (CC-BY-NC 4.0) for Meta's M4T Seamless.
- Include missing free tier details (e.g., AWS Polly Long-Form) and additional costs (e.g., ElevenLabs TTS overages).

**Verify Directly with Vendors:** For providers with unclear or custom pricing (Neuphonic, NVIDIA Riva Enterprise, all Enterprise tiers), direct contact with vendor sales teams is necessary to obtain accurate quotes tailored to specific usage requirements and SLAs. Direct verification is also strongly advised for Fish Audio's API pricing due to the identified contradictions.

**Acknowledge Data Timeliness:** Recognize that pricing and plan structures in the rapidly evolving AI services market can change frequently. The verification is based on the provided research materials, whose capture dates are mostly unknown but predate May 2, 2025. Always seek the most current information directly from vendor websites or sales representatives before making final decisions.

**Consider Total Cost and Value:** When comparing providers, look beyond headline prices per character or minute. Factor in:

- Bundled features (e.g., ElevenLabs STT hours).
- Add-on costs (e.g., Deepgram redaction).
- Minimum charges or billing increments (e.g., AWS Transcribe's 15s minimum).
- Fair Usage Policies on "unlimited" plans.
- Specific feature requirements (e.g., ultra-low latency from Cartesia/LMNT/Neuphonic, emotional intelligence from Hume AI, advanced cloning from ElevenLabs/Play.ht/XTTS).
- Costs associated with self-hosting open-source alternatives (hardware, maintenance, expertise).
