#!/usr/bin/env python3
"""
FIX REMAINING 23 ISSUES - HIGHLY SPECIFIC
Target the exact remaining issues with custom content for each
"""

import os, json

env_vars = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"')
os.environ.update(env_vars)

import psycopg2
conn = psycopg2.connect(os.environ.get('POSTGRES_URL'))
cur = conn.cursor()

# Map of exact fixes for each topic/section
FIXES = {
    ('advanced', 'collocations-advanced', 5): {
        'type': 'replace_paragraph',
        'text': 'Prepositional collocations are fixed combinations of words that include a preposition, such as "good at", "interested in", and "depend on". These combinations are not governed by logical rules; they must be memorized through exposure and practice. For Indian learners, prepositional collocations are particularly challenging because Hindi prepositions do not map one-to-one with English prepositions. For example, Hindi speakers often say "good in mathematics" (influenced by "अच्छा है" + locative "में"), but correct English is "good at mathematics". UPSC essays, SSC descriptive tests, and banking exams penalize incorrect preposition usage heavily because it marks non-native fluency. This section covers the most common prepositional collocations organized by adjective, verb, and noun categories.'
    },

    ('advanced', 'mixed-conditionals', 4): {
        'type': 'replace_paragraph',
        'text': 'Mixed conditionals combine time frames from different conditional types to express complex hypothetical relationships. The most common pattern mixes a past condition (third conditional) with a present result (second conditional): "If I had studied engineering (past), I would be an engineer now (present)." This structure is particularly useful for expressing regret about past decisions that affect the present. Understanding mixed conditionals requires mastery of both second and third conditional structures. For competitive exam essay writing, mixed conditionals add sophistication and allow candidates to explore cause-effect relationships across time. The key structural patterns are: (1) Past action → present result: If + past perfect, would + base verb, and (2) Present state → past result: If + past simple, would have + past participle.'
    },

    ('advanced', 'past-modals', 3): {
        'type': 'replace_paragraph',
        'text': 'May have and might have express possibility or uncertainty about past events. They indicate that something possibly happened, but we are not sure. The structure is may/might + have + past participle. Example: "She may have left already" means it is possible she left, but we don\'t know for certain. The difference between may have and might have is subtle: might have suggests slightly lower probability, but in modern English they are often interchangeable. For UPSC essays and SSC descriptive tests, using past modals demonstrates grammatical sophistication and allows nuanced expression of uncertainty, speculation, and logical deduction about past events.'
    },

    ('advanced', 'past-modals', 4): {
        'type': 'replace_paragraph',
        'text': 'Should have expresses criticism, regret, or advice about past actions that did not happen. It implies that something was the right thing to do, but it was not done. Structure: should + have + past participle. Example: "You should have studied harder" criticizes past failure to study adequately. This modal is frequently used for expressing regret: "I should have taken that job offer" means the speaker regrets not taking it. Hindi speakers often confuse this with present advice ("you should study"), failing to distinguish past reference. In competitive exams, should have is essential for writing reflective essays, analyzing historical decisions, and expressing retrospective judgment.'
    },

    ('advanced', 'past-modals', 5): {
        'type': 'replace_paragraph',
        'text': 'Could have expresses missed opportunity, unrealized ability, or past possibility. It indicates that something was possible in the past but did not happen. Structure: could + have + past participle. Example: "He could have won the race" means he had the ability to win, but he did not. Could have is used to express regret about missed opportunities: "I could have become a doctor" (but I chose a different path). It also expresses past possibility in conditional sentences: "If you had asked, I could have helped." Hindi speakers often use simple past ("I could do it" instead of "I could have done it"), missing the unrealized aspect. For essay writing, could have adds depth by exploring alternative scenarios and paths not taken.'
    },

    ('advanced', 'past-modals', 6): {
        'type': 'replace_paragraph',
        'text': 'Would have is used in third conditional sentences to express hypothetical past situations and their imagined results. It describes what would have happened if past circumstances had been different. Structure: would + have + past participle. Example: "If I had known, I would have helped" means: because I did not know, I did not help. Would have is also used to express assumptions about past events: "He would have arrived by now" (I assume he has arrived). Hindi speakers often struggle with third conditional because Hindi uses different structures for counterfactual past statements. In UPSC and SSC essays, third conditional with would have is essential for analyzing historical events ("If Gandhiji had not led the movement, India would have gained independence differently") and discussing alternative scenarios.'
    },

    ('foundation', 'idioms-expressions', 1): {
        'type': 'replace_paragraph',
        'text': 'Idioms and expressions are phrases whose meaning cannot be understood from the individual words; the phrase as a whole has a figurative meaning different from its literal meaning. For example, "it\'s raining cats and dogs" means "it\'s raining heavily," not that animals are falling from the sky. Idioms are culturally specific and must be learned as fixed phrases. For Indian competitive exam aspirants, idioms pose challenges because: (1) Hindi idioms do not translate directly ("हाथ कंगन को आरसी क्या" has no English equivalent), (2) English idioms often have cultural references unfamiliar to Indian learners, and (3) using idioms incorrectly sounds unnatural and can confuse meaning. However, appropriate use of common idioms in UPSC essays, SSC descriptive papers, and IELTS speaking significantly enhances fluency perception and vocabulary range scores. This section covers essential idioms organized by theme (time, success, difficulty, emotions) with clear explanations and usage examples.'
    },

    ('foundation', 'past-perfect', 4): {
        'type': 'add_practice',
        'questions': [
            {'question': 'She told me that she ______ (finish) her homework before dinner.', 'answer': 'had finished', 'explanation': 'Past perfect in reported speech: action completed before another past action.'},
            {'question': 'When I arrived at the station, the train ______ (leave).', 'answer': 'had left / had already left', 'explanation': 'Past perfect shows the train left BEFORE I arrived (earlier past action).'},
            {'question': 'They ______ (not/see) the movie before, so they enjoyed it.', 'answer': 'had not seen / hadn\'t seen', 'explanation': 'Negative past perfect: had not + past participle.'},
            {'question': 'By the time we reached, the shop ______ (close).', 'answer': 'had closed', 'explanation': '"By the time" signals past perfect: action complete before reference point.'},
            {'question': 'He realized he ______ (make) a big mistake.', 'answer': 'had made', 'explanation': 'Past perfect after "realized" for prior action.'},
        ]
    },

    ('foundation', 'speaking-basics', 5): {
        'type': 'add_practice',
        'questions': [
            {'question': 'Practice dialogue: Introduce yourself at a job interview.', 'answer': 'Good morning/afternoon. My name is [Name]. I\'m very pleased to be here. I have a degree in [subject] from [university], and I have [X] years of experience in [field]. I\'m excited about this opportunity because [reason].', 'explanation': 'Formal introduction structure: greeting + name + qualifications + experience + interest.'},
            {'question': 'Practice dialogue: Ask for directions to the nearest bank.', 'answer': 'Excuse me, could you please tell me how to get to the nearest bank from here? / Sorry to bother you, but I\'m looking for a bank. Is there one nearby?', 'explanation': 'Polite question: excuse me/sorry + could you please + specific request.'},
            {'question': 'Practice dialogue: Order food at a restaurant.', 'answer': 'Hello, I\'d like to order [dish name], please. Could I also have [drink]? And can you make it less spicy? Thank you.', 'explanation': 'Restaurant ordering: I\'d like + item + polite requests (Could I, Can you) + thanks.'},
            {'question': 'Practice dialogue: Call customer service to complain about a defective product.', 'answer': 'Hello, I\'m calling regarding a [product] I purchased on [date]. Unfortunately, it stopped working after [time]. I have the receipt. Could you help me with a replacement or refund?', 'explanation': 'Complaint structure: state problem clearly + provide details + request solution politely.'},
            {'question': 'Practice dialogue: Respond to "How are you?" in formal and informal contexts.', 'answer': 'Formal: I\'m doing well, thank you. How about you? / Informal: I\'m good, thanks! How are you?', 'explanation': 'Formal uses full forms (I am), informal uses contractions (I\'m). Both require reciprocal question.'},
        ]
    },

    ('ielts-toefl', 'ielts-speaking', 1): {
        'type': 'expand_paragraph',
        'addition': ' The IELTS Speaking test is a face-to-face interview with a certified examiner lasting 11-14 minutes. It assesses your spoken English proficiency across four criteria: Fluency and Coherence (25%), Lexical Resource/Vocabulary (25%), Grammatical Range and Accuracy (25%), and Pronunciation (25%). The test has three distinct parts: Part 1 (Introduction and Interview, 4-5 minutes) covers familiar topics like home, family, work, studies, and hobbies. Part 2 (Long Turn, 3-4 minutes) requires you to speak for 2 minutes on a given topic after 1 minute of preparation. Part 3 (Discussion, 4-5 minutes) involves a deeper discussion related to the Part 2 topic, with more abstract questions. Indian test-takers commonly struggle with natural fluency (due to translating from Hindi mentally), pronunciation of specific sounds (/θ/, /ð/, /v/), and using a wide range of vocabulary and complex grammar structures. Strategic preparation focusing on these weak areas can improve your band score significantly.'
    },

    ('ielts-toefl', 'ielts-speaking', 2): {
        'type': 'expand_paragraph',
        'addition': ' In IELTS Speaking Part 1, the examiner asks 4-5 questions each on 2-3 familiar topics such as hometown, family, daily routine, hobbies, or current studies/work. Your answers should be direct but developed beyond yes/no responses. Aim for 2-3 sentences per answer (15-30 seconds speaking time). Use the expand technique: Answer directly + Add detail + Give example/reason. Example: Q: "Do you like reading?" A: "Yes, I enjoy reading quite a lot. I particularly like non-fiction books about history and biographies. Recently, I read a fascinating book about the Indian independence movement, which gave me a much deeper understanding of that period." Avoid memorized answers; examiners are trained to detect them. Instead, practice natural responses using a variety of tenses, opinion markers (I think, in my view), and linking words (however, moreover, for instance). Common mistakes by Indian candidates: over-formal language (using "utilize" instead of "use"), unnatural word order (influenced by Hindi syntax), and speaking in a monotone without natural stress patterns.'
    },

    ('ielts-toefl', 'ielts-speaking', 5): {
        'type': 'expand_paragraph',
        'addition': ' Fluency in IELTS refers to your ability to speak at a natural pace without excessive hesitation, repetition, or self-correction. It does NOT mean speaking fast; rather, it means maintaining smooth speech flow with appropriate pauses. Examiners penalize frequent hesitations ("uh", "um", "like"), false starts, and long silences. To improve fluency: (1) Use discourse markers to buy thinking time naturally: "That\'s an interesting question...", "Let me think...", "Well, actually...". (2) Practice speaking English daily, even if just narrating your activities aloud. (3) Record yourself and identify where you pause unnaturally. Coherence means your ideas connect logically using appropriate linking words. Master these connectors: Sequencing (firstly, then, finally), Adding (moreover, furthermore, in addition), Contrasting (however, on the other hand, although), Exemplifying (for instance, such as, for example), Concluding (therefore, in conclusion, overall). Indian candidates often overuse "and" and "but" while underusing sophisticated linkers, which limits their Coherence score. Practice using at least 5-7 different linking words in each 2-minute speech.'
    },

    ('ielts-toefl', 'toefl-integrated', 2): {
        'type': 'expand_paragraph',
        'addition': ' The TOEFL Integrated Writing Task requires you to read a short academic passage (230-300 words) for 3 minutes, then listen to a lecture (about 2 minutes) on the same topic. Typically, the lecture challenges or contradicts the reading passage. You must then write a response (150-225 words in 20 minutes) summarizing the lecture points and explaining how they relate to (usually cast doubt on) the reading passage. You are NOT asked for your opinion. The task tests your ability to synthesize information from multiple sources. Scoring focuses on: (1) Accurately conveying information from both sources, (2) Organizing the response clearly, (3) Using appropriate grammar and vocabulary, (4) Demonstrating good command of English writing conventions. Indian test-takers commonly make these mistakes: giving personal opinions (not required), focusing too much on the reading instead of the lecture, copying word-for-word instead of paraphrasing, and poor time management (spending too long on reading notes instead of writing). A good strategy: Take structured notes during the lecture (use abbreviations, symbols, bullet points), write a simple template-based response (intro + 3 body paragraphs matching 3 lecture points + brief conclusion), and reserve 2-3 minutes at the end for proofreading.'
    },

    ('ielts-toefl', 'toefl-integrated', 3): {
        'type': 'expand_paragraph',
        'addition': ' TOEFL Integrated Speaking Task 1 (also called "Read-Listen-Speak") follows this sequence: (1) Read a short passage (75-100 words) about a campus situation (university policy change, facility announcement, etc.) for 45-50 seconds, (2) Listen to a conversation (60-90 seconds) where two students discuss the announcement—one usually has a strong opinion about it, (3) Speak for 60 seconds summarizing the student\'s opinion and the reasons they give. You have 30 seconds to prepare your response. This task assesses your ability to combine information from reading and listening sources and deliver a coherent oral summary. Key strategy: During reading, note the TOPIC and MAIN POINTS of the announcement. During listening, note WHO has an opinion (usually the second speaker), whether they AGREE or DISAGREE, and TWO REASONS they give. Your response template: "The announcement states that [reading main point]. The [man/woman] [agrees/disagrees] with this. [He/She] thinks [reason 1]. [He/She] also mentions [reason 2]." Speak clearly at a moderate pace—rushed, unclear speech lowers your score even if content is accurate. Common mistakes: Spending too much time on the reading summary (should be one sentence only), forgetting to mention both reasons, using first-person ("I think") instead of third-person ("The woman thinks"), and running out of time before completing the response.'
    },

    ('ielts-toefl', 'toefl-integrated', 5): {
        'type': 'expand_paragraph',
        'addition': ' Effective note-taking is critical for TOEFL integrated tasks because you cannot replay the audio. Use these strategies: (1) Use abbreviations and symbols: → (leads to, causes), ≠ (different from, not), + (and, also, more), ex. (example), b/c (because), govt (government). (2) Organize spatially: Write reading notes on left half of paper, listening notes on right, so you can see contrasts easily. (3) Focus on main ideas and supporting examples: Don\'t write every word; capture key concepts. (4) Listen for signal phrases that indicate structure: "First," "However," "For example," "In contrast," "Therefore." (5) For Integrated Writing: Note the 3 main points from the reading passage as brief phrases, then note how the lecture responds to each point. For Integrated Speaking: Note the topic, the speaker\'s position (agree/disagree), and 2 reasons with brief support. (6) Practice shorthand consistently: If you use "univ" for "university" once, use it throughout all your practice so it becomes automatic. Indian students often make the mistake of writing too much during the reading phase, leaving no space for listening notes. Remember: the lecture is more important for your response than the reading passage, so prioritize lecture notes. Practice note-taking with TED talks or university lectures on YouTube to build speed and accuracy.'
    },

    ('ielts-toefl', 'toefl-integrated', 6): {
        'type': 'expand_paragraph',
        'addition': ' Using template phrases helps you structure your response quickly and confidently, which is essential under time pressure. However, use templates as a flexible framework, not rigid memorization. For Integrated Writing: Intro: "The reading passage discusses [topic]. However, the lecturer challenges this view by presenting contrasting evidence." Body paragraphs: "First, the reading states that [point 1]. The lecturer casts doubt on this by explaining that [lecture counter-argument]." "Second, the passage claims [point 2]. In contrast, the lecturer argues that [lecture counter]." "Finally, the reading suggests [point 3]. The lecturer refutes this by pointing out that [lecture counter]." Conclusion: "In summary, the lecturer systematically undermines the main points presented in the reading passage." For Integrated Speaking Task 1: "The announcement states that [main point from reading]. The [man/woman] [agrees/disagrees] for two reasons. First, [he/she] mentions that [reason 1]. Second, [he/she] points out that [reason 2]. For these reasons, [he/she] has a [positive/negative] view of the change." Practice inserting your specific content into these templates until it feels natural. Avoid overusing the same transition words; vary your language for higher scores: instead of always saying "The lecturer says," use "explains," "argues," "points out," "mentions," "asserts," "claims."'
    },

    ('ielts-toefl', 'toefl-integrated', 7): {
        'type': 'add_practice',
        'questions': [
            {'question': 'Integrated Writing Practice: Reading says "Online learning increases accessibility." Lecture says "Many students lack reliable internet access, making online learning less accessible." Write the body paragraph.', 'answer': 'The reading passage claims that online learning increases educational accessibility. However, the lecturer challenges this by pointing out that many students, particularly those from economically disadvantaged backgrounds, lack reliable internet access. This digital divide makes online learning less accessible for these students, contradicting the reading\'s assertion.', 'explanation': 'Structure: State reading point → Use contrast transition (however/in contrast) → State lecture counter-argument → Connect back to contradiction.'},
            {'question': 'Integrated Writing Practice: Write an introduction for a response where the lecture contradicts the reading on "Benefits of four-day work week."', 'answer': 'The reading passage discusses the various benefits of implementing a four-day work week, including increased employee productivity and better work-life balance. However, the lecturer casts doubt on these claims by presenting evidence from recent studies that suggest potential drawbacks to this approach.', 'explanation': 'Introduction template: Topic + reading\'s main stance + however/but + lecturer\'s contrary position.'},
            {'question': 'Integrated Speaking Practice: Reading: "Library hours extended to midnight." Conversation: Woman disagrees because (1) safety concerns walking at night, (2) staff will be overworked. Prepare your 60-second response outline.', 'answer': 'Outline: (1) Announcement: library hours extended to midnight. (2) Woman disagrees. (3) Reason 1: safety—not safe walking to dorms late at night, poor lighting. (4) Reason 2: staff overworked—already understaffed, extra hours burden on employees. (5) Conclusion: For these reasons, she opposes the extension.', 'explanation': 'Outline should hit: announcement summary (1 sentence), position (disagree), reason 1 + detail, reason 2 + detail, brief conclusion. 60 seconds = about 140-160 words at moderate pace.'},
        ]
    },

    ('ielts-toefl', 'toefl-integrated', 8): {
        'type': 'add_practice',
        'questions': [
            {'question': 'Integrated Speaking Task 1 Practice: Reading: "Cafeteria menu to include more vegan options." Listening: Man agrees, says (1) healthier choices, (2) environmentally friendly. Give your full response.', 'answer': 'The announcement states that the cafeteria will add more vegan options to its menu. The man agrees with this decision for two main reasons. First, he believes vegan options provide healthier choices for students. He mentions that plant-based meals are often lower in saturated fat and cholesterol. Second, he points out that vegan food is more environmentally friendly, requiring fewer resources like water and producing less greenhouse gas emissions compared to meat production. For these reasons, he supports the new menu changes.', 'explanation': 'Follow template: announcement summary → man agrees → reason 1 + elaboration → reason 2 + elaboration → conclusion. Speak at moderate pace, clearly, for about 55-60 seconds.'},
            {'question': 'Integrated Speaking Task 1 Practice: Reading: "Campus parking fees increase by $50/semester." Listening: Woman disagrees, says (1) students already struggling financially, (2) public transport inadequate. Give your full response.', 'answer': 'The announcement explains that campus parking fees will increase by fifty dollars per semester. The woman disagrees with this decision for two reasons. First, she argues that many students are already struggling financially, working part-time jobs to afford tuition and living expenses. An additional fifty-dollar fee creates an extra burden on already tight budgets. Second, she points out that the public transportation serving the campus is inadequate. Buses are often overcrowded and unreliable, so many students have no choice but to drive and pay for parking. For these reasons, she opposes the fee increase.', 'explanation': 'Template: announcement → disagrees → reason 1 + support → reason 2 + support → conclusion. This response is approximately 60 seconds at a natural speaking pace.'},
        ]
    },

    ('real-world', 'email-writing', 8): {
        'type': 'add_practice',
        'questions': [
            {'question': 'Write a professional email requesting an appointment with your professor to discuss your research project.', 'answer': 'Subject: Request for Appointment - Research Project Discussion\n\nDear Professor [Name],\n\nI hope this email finds you well. I am [Your Name], a student in your [Course Name] class. I am writing to request a meeting with you to discuss my research project on [Topic].\n\nI have completed the initial literature review and would greatly appreciate your guidance on refining my research questions and methodology. Would you be available for a 20-30 minute meeting sometime next week? I am flexible with timings and can adjust to your schedule.\n\nPlease let me know your availability, and I will be there at the specified time.\n\nThank you very much for your time and consideration.\n\nBest regards,\n[Your Name]\n[Student ID]\n[Contact Number]', 'explanation': 'Professional email structure: Clear subject line + Formal greeting + Self-introduction + State purpose + Specific request + Flexibility + Thank you + Formal closing with full details.'},
            {'question': 'Write a complaint email to customer service about a delayed package that was supposed to arrive 10 days ago.', 'answer': 'Subject: Complaint Regarding Delayed Package - Order #[Number]\n\nDear Customer Service Team,\n\nI am writing to express my concern about a significant delay in receiving my order (Order #[Number], placed on [Date]).\n\nAccording to the tracking information, my package was expected to arrive on [Expected Date], which was 10 days ago. However, the tracking status has not been updated since [Last Update Date], and I have not received the package.\n\nThis delay has caused considerable inconvenience as the items were needed urgently. I would appreciate if you could:\n\n1. Investigate the current status and location of my package\n2. Provide a revised delivery date\n3. Consider expedited shipping at no additional cost due to this delay\n\nI have attached the order confirmation and tracking details for your reference. I look forward to a prompt resolution of this matter.\n\nThank you for your attention to this issue.\n\nSincerely,\n[Your Name]\n[Order Number]\n[Contact Email]\n[Phone Number]', 'explanation': 'Complaint email structure: Clear subject with order number + Professional tone (not angry) + State problem with specifics + Explain impact + Request specific actions (numbered list) + Mention attachments + Professional closing.'},
            {'question': 'Write an email accepting a job offer and requesting clarification on start date and onboarding process.', 'answer': 'Subject: Acceptance of Job Offer - [Position Name]\n\nDear [Hiring Manager Name],\n\nThank you very much for offering me the position of [Job Title] at [Company Name]. I am delighted to accept this offer and am excited about the opportunity to join your team.\n\nAs discussed, I accept the offered salary of [Amount] per annum, along with the benefits package outlined in the offer letter. I have reviewed all the terms and conditions and am in agreement with them.\n\nI would like to confirm a few details regarding my start date and onboarding:\n\n1. Start Date: The offer letter mentions [Date]. Please confirm if this is still accurate, or if there is any flexibility.\n2. Onboarding Process: Could you please share information about the onboarding schedule, required documentation, and first-day reporting time and location?\n3. Pre-joining Formalities: If there are any forms, documents, or background verification processes I need to complete before my start date, please let me know at your earliest convenience.\n\nI have attached the signed offer letter as requested. Please let me know if you need any additional information from my end.\n\nThank you once again for this wonderful opportunity. I look forward to contributing to the team and starting this new chapter of my career.\n\nBest regards,\n[Your Full Name]\n[Phone Number]\n[Email Address]', 'explanation': 'Job acceptance email structure: Clear subject + Express thanks and accept offer + Confirm salary/terms + Request specific clarifications (numbered) + Mention attachments + Express enthusiasm + Professional closing.'},
        ]
    },
}

fixed = 0

for (path, topic, sec_idx), fix_data in FIXES.items():
    cur.execute("""
        SELECT content FROM topic_study_content
        WHERE subject_id='english' AND path_id=%s AND topic_id=%s
    """, (path, topic))

    result = cur.fetchone()
    if not result:
        print(f"⚠️  {path}/{topic} not found")
        continue

    content_json = result[0]
    sections = content_json['sections']

    if sec_idx >= len(sections):
        print(f"⚠️  {path}/{topic} - Section {sec_idx+1} out of range")
        continue

    section = sections[sec_idx]

    if fix_data['type'] == 'replace_paragraph':
        # Find first paragraph block and replace it
        for block in section.get('content', []):
            if isinstance(block, dict) and block.get('type') == 'paragraph':
                block['text'] = fix_data['text']
                break
        else:
            # No paragraph found, add one
            section['content'] = [{'type': 'paragraph', 'text': fix_data['text']}] + section.get('content', [])

        print(f"✅ {path}/{topic} - Section {sec_idx+1}: Replaced paragraph")

    elif fix_data['type'] == 'expand_paragraph':
        # Find first paragraph and append addition
        for block in section.get('content', []):
            if isinstance(block, dict) and block.get('type') == 'paragraph':
                block['text'] = block.get('text', '') + fix_data['addition']
                break

        print(f"✅ {path}/{topic} - Section {sec_idx+1}: Expanded paragraph")

    elif fix_data['type'] == 'add_practice':
        # Remove old practice, add new
        content_blocks = [b for b in section.get('content', []) if not (isinstance(b, dict) and b.get('type') == 'practice')]
        content_blocks.append({'type': 'practice', 'questions': fix_data['questions']})
        section['content'] = content_blocks

        print(f"✅ {path}/{topic} - Section {sec_idx+1}: Added {len(fix_data['questions'])} practice questions")

    # Update database
    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id='english' AND path_id=%s AND topic_id=%s
    """, (json.dumps(content_json), path, topic))

    fixed += 1
    conn.commit()

print(f"\n{'='*80}")
print(f"COMPLETE: {fixed} sections fixed with highly specific content")
print(f"{'='*80}\n")

cur.close()
conn.close()
