# Using generative AI to scale DuoRadio 10x faster

We scaled DuoRadio DAUs from 100K to 5.5M while cutting costs by 99%. Here's how.

March 11, 2025[Luis Mas Castillo](https://blog.duolingo.com/author/luis-mas-castillo/)[Sophie Mackey](https://blog.duolingo.com/author/sophie-mackey/)[Cindy Berger](https://blog.duolingo.com/author/cindy-berger/)

![Using generative AI to scale DuoRadio 10x faster](https://blog.duolingo.com/content/images/2025/03/duoradio-1.png)

DuoRadio is an [audio experience that improves listening comprehension](https://blog.duolingo.com/duoradio-listening-practice/) through short, podcast-like radio shows featuring Duolingo's beloved World characters. When DuoRadio first launched in late 2023, it quickly became clear that the feature had enormous learning potential---if we could expand it to more courses, languages, and learners.

## DuoRadio's scaling challenge

Despite its initial promise, DuoRadio's reach was limited by the labor-intensive production process required to bring it to learners. Crafting just 300 episodes for a handful of courses took us nearly a year. Each episode demanded meticulous scripting, precise alignment with curriculum goals, voice actors, and specialized audio editing. As a result, despite its popularity, DuoRadio remained a niche offering, unable to scale to the broader Duolingo community.

Our initial exploration of generative AI for scaling DuoRadio involved two main approaches: generating original scripts from scratch and translating existing content. Our first attempt to generate original scripts produced subpar results and required extensive manual editing to both reflect the corresponding curriculum's content and meet our learning guidelines. In a second attempt, we experimented with automated translations of existing episodes initially written in English. However, these translations frequently missed the mark regarding translation accuracy and proficiency level, again leading to time-consuming revisions. As a result, only a small percentage of our learners had access to this listening content.

## Rewriting the script: the Hackathon breakthrough

At Duolingo, our Hackathons have always allowed us to think creatively, experiment, and tackle significant challenges. Just over a decade after our [inaugural hackathon](https://blog.duolingo.com/duolingos-inaugural-hackathon/), we knew we had a problem to solve that would require creativity and a hacker's mindset: how to scale DuoRadio. A group of Product Managers and Learning Designers teamed up to find a faster way to produce high-quality episodes---without compromising the learner experience.

![Another Duo shares a photo of the team's "a-ha" moment on Slack.](https://blog.duolingo.com/content/images/2025/03/Slack-screenshot.png)

During our initial testing, we realized that adding more constraints on our generative AI prompts didn't work well. Instead, feeding existing content from our learning curriculum delivered far better results as it gave our generative AI model specific patterns to follow (as opposed to more complex instructions). By supplying the prompts with well-crafted sentences and exercises created by our Learning Designers for Duolingo lessons, it was possible to generate a large volume of promising scripts (level-appropriate, grammatically sound, using the correct vocabulary, etc.).

But we hold a high-quality bar at Duolingo, and while much of that output was good, some of it wasn't. To filter out only the best scripts for our learners, our Learning Designers crafted effective prompts that assessed the outputs for naturalness, grammaticality, coherence, logic, and other key learning criteria. And just like magic, the scripts that passed through those filters met our quality standards and showed us a clear path to rapidly scale DuoRadio.

## Building momentum

On the Thursday after the 2024 Hackathon, we shared our findings with the team to gut-check our approach and ensure we weren't missing anything critical. Encouraged by their feedback, we used Workflow Builder---our internal content generation prototyping tool---to automatically generate DuoRadio content at scale and demoed it to leadership. They were impressed. This proved that automation could maintain DuoRadio's value proposition while significantly increasing coverage and maintaining Duolingo's high quality bar.

With leadership on board, we moved forward with a structured plan, simplifying certain pieces of the feature to make automation more feasible. Throughout, we preserved DuoRadio's core educational value: providing learners with additional listening practice and the opportunity to hear grammar and vocabulary from their Duolingo lessons in a new context.

## DuoRadio's scaling formula

![A simplified visual of DuoRadio's end-to-end automation pipeline](https://lh7-rt.googleusercontent.com/docsz/AD_4nXelsdqg4TS2sqRMMT0uoNEeEdrv-IfNAvV0_QMLvQVhmXQnEx4VYVOqaUvLMo6KEeaB3pJAaBO7ogIegtic5lgHxP1voE9LbmW9Q_JWyLjVvH76uFoF0PntYoGYMRbp4tPqlkRxhg?key=xSRVMyUChk1xaBadLJ_Crjs1)

### Curriculum-driven AI script generation

As we created DuoRadio content for courses teaching languages other than English, we found that English-only generative AI prompt instructions were less effective. Leveraging language-specific content from each course curriculum dramatically improved accuracy and relevance.

### Exercise standardization

Initially, our generative AI prompts had the freedom to sequence and place exercises, but the quality was a hit or miss. To address that, we leveraged learner session data to place exercises optimally within episodes. Standardizing exercise order and placement helped keep the session structure consistent and made automation more reliable.

### Comprehensive evaluators

AI could generate many potential episodes, but they didn't all meet our standards. To keep our high quality bar, we created a bunch of extra episodes and built a generative AI-powered filtering process that assessed scripts on naturalness, grammaticality, coherence, logic, etc.---so only the best made it to learners. Our Learning Designers refined these evaluator prompts over time to filter for better and better content. With each step along the way, they raised the bar for our learners.

### Automated audio production

Now that we'd solved the scripts' automation, we turned to audio production. Advanced Text-to-Speech (TTS) enabled us to automatically create lifelike voiceovers in multiple languages. Meanwhile, audio hashing (a technique for quickly storing and retrieving pre-generated audio) ensured consistent intros and outros, dramatically reducing manual editing time.

### End-to-end generation pipelines

Finally, we built end-to-end pipelines to automate the entire lifecycle, from script creation to final deployment. With zero human intervention post-initiation, DuoRadio scaled at a pace once thought impossible.

## DuoRadio's automation impact by the numbers

### Reaching More Learners Faster

- **DuoRadio daily sessions grew from 500K to 5M in fewer than 6 months**, bringing immersive listening practice to millions more people learning with Duolingo.

![DuoRadio DAU growth (past 12 months)](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdkeXLhSriU8GcUBFMj4hb7mu44DaJto2C8b2iGA1VvtT-6gYTExr0jiMHZvKLxHnLFvXNi3VTNNSPoO1Jb9PVFwUh1Sl5Qk6EauA3Yb17in2d1okKQfbTmBfcVtnUq0M81_bfxag?key=xSRVMyUChk1xaBadLJ_Crjs1 "Chart")

### More Episodes in Each Unit

- **Automation allowed for more episodes per unit**. By eliminating manual scripting, the team could focus on developing a wider range of DuoRadio show concepts, exposing learners to more DuoRadio nodes, and ensuring that each episode was engaging and reflective of Duolingo's curriculum.

![Unit Structure before and after DuoRadio's automation.](https://blog.duolingo.com/content/images/2025/03/Path-visual-1.png)

### Course content expansion

- **Automation enabled us to dramatically increase the number of episodes available to learners**. Where it once would have taken 5+ years to deliver this volume of DuoRadio's content, it took fewer than two quarters to go from 2 to 25+ courses and increase total episodes from 300 to 15,000+ (while saving 99% of the costs). Learners across diverse languages and proficiency levels could finally enjoy DuoRadio's immersive listening experience.

![Total number of unique episodes created.](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeJZpKpjVVGhCjGlUrg5fYrayaooQdPYEXGl4xyrmvb-KE2cdZWMz6iW5WLdUMke8t2ZG5Z2MniD6nUynBHhGYCqkvhtyZsGLTVVNbCdjGIt4hSwdlQpSEWJx9q_smxIl8bf9Co?key=xSRVMyUChk1xaBadLJ_Crjs1 "Chart")

## What's Next?

### Improving DuoRadio

- Having scaled DuoRadio, we're refining session length and exercise variety to ensure each episode stays fresh, engaging, and effective.

### Expanding Longform Content

- DuoRadio is just the start---we plan to integrate more longform content into more of our courses, giving learners various ways to build their language skills through immersive and context-rich experiences.

DuoRadio's scaling journey underscores the power of balancing automation with expert oversight. By blending generative AI, structured evaluation, carefully designed course curricula and thoughtful product design, we're bringing authentic listening experiences to millions---and we're just getting started.
