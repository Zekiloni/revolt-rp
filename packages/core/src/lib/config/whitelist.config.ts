import { IWhitelistTest } from '@revolt-rp/common';

export const whitelistConfig: IWhitelistTest = {
  maxEssayQuestions: 2,
  maxQuestions: 5,
  questions: [
    {
      question: "Choose the correct sentence:",
      answers: [
        { content: "He don't know the rules." },
        { content: "He doesn't knows the rules." },
        { content: "He doesn't know the rules.", isCorrect: true },
        { content: "He not know the rules." }
      ]
    },
    {
      question: "What is 'metagaming'?",
      answers: [
        { content: "Using out-of-character info in-character.", isCorrect: true },
        { content: "Repairing your car mid-chase." },
        { content: "Abusing animation bugs." },
        { content: "Talking in character on Discord." }
      ]
    },
    {
      question: "VDM means:",
      answers: [
        { content: "Using a vehicle to kill without proper RP reason.", isCorrect: true },
        { content: "Dying in a vehicle accident." },
        { content: "Chatting while driving." },
        { content: "Driving too fast on a highway." }
      ]
    },
    {
      question: "Powergaming is:",
      answers: [
        { content: "Playing during peak hours." },
        { content: "Forcing unrealistic actions without chance to react.", isCorrect: true },
        { content: "Farming money from jobs." },
        { content: "Using in-game voice chat." }
      ]
    },

    // === SET 2 ===
    {
      question: "Pick the correct word: “I have never ____ such a thing.”",
      answers: [
        { content: "seen", isCorrect: true },
        { content: "saw" },
        { content: "see" },
        { content: "seed" }
      ]
    },
    {
      question: "FearRP means:",
      answers: [
        { content: "Refusing to fear any threats." },
        { content: "Showing realistic fear for your life/limbs.", isCorrect: true },
        { content: "Pretending to be afraid in OOC chat." },
        { content: "Standing still when shot." }
      ]
    },
    {
      question: "DM means:",
      answers: [
        { content: "Randomly changing clothes." },
        { content: "Killing players without valid RP reason.", isCorrect: true },
        { content: "Re-logging after death." },
        { content: "Refueling the vehicle." }
      ]
    },
    {
      question: "What happens after PK:",
      answers: [
        { content: "You keep memories after death." },
        { content: "You forget events leading to your death.", isCorrect: true },
        { content: "You must revenge your death." },
        { content: "You switch to a new character." }
      ]
    },

    // === SET 3 ===
    {
      question: "Choose the grammatically correct sentence:",
      answers: [
        { content: "They was running quickly." },
        { content: "They were running quickly.", isCorrect: true },
        { content: "They is running quickly." },
        { content: "They are ran quickly." }
      ]
    },
    {
      question: "Value of Life (VoL) requires:",
      answers: [
        { content: "Ignoring all threats if you have armor." },
        { content: "Treating your life as precious; avoiding needless risks.", isCorrect: true },
        { content: "Always fighting back no matter the odds." },
        { content: "Log out when threatened." }
      ]
    },
    {
      question: "Revenge killing after PK:",
      answers: [
        { content: "Is always allowed." },
        { content: "Is allowed only with admin permission." },
        { content: "Is not allowed; you forget events leading to death.", isCorrect: true },
        { content: "Is allowed if done within 10 minutes." }
      ]
    },
    {
      question: "'OOC' stands for:",
      answers: [
        { content: "On-our-channel" },
        { content: "Out-of-character", isCorrect: true },
        { content: "On-origin-comms" },
        { content: "Out-of-combat" }
      ]
    },

    // === SET 4 ===
    {
      question: "Select the correct sentence:",
      answers: [
        { content: "There is too many rules to follow." },
        { content: "There are too many rules to follow.", isCorrect: true },
        { content: "There are too much rules to follow." },
        { content: "There is too much rules to follow." }
      ]
    },
    {
      question: "NonRP example:",
      answers: [
        { content: "Running from 4 armed cops with a knife while you're injured.", isCorrect: true },
        { content: "Complying when outgunned." },
        { content: "Calling for backup ICly." },
        { content: "Roleplaying injuries." }
      ]
    },
    {
      question: "Combat logging (LTA) is:",
      answers: [
        { content: "Leaving the game to avoid RP consequences.", isCorrect: true },
        { content: "Logging all combat in a notepad." },
        { content: "Announcing combat in OOC." },
        { content: "Relogging to fix a texture bug." }
      ]
    },
    {
      question: "Powergaming includes:",
      answers: [
        { content: "Using /me to describe actions." },
        { content: "Forcing outcomes without allowing reaction.", isCorrect: true },
        { content: "Typing slower to be realistic." },
        { content: "Accepting consequences." }
      ]
    },

    // === SET 5 ===
    {
      question: "Pick the correct word: “It was ____ obvious mistake.”",
      answers: [
        { content: "a" },
        { content: "an", isCorrect: true },
        { content: "the" },
        { content: "one" }
      ]
    },
    {
      question: "IC stands for:",
      answers: [
        { content: "In-character", isCorrect: true },
        { content: "Immediate call" },
        { content: "Internal chat" },
        { content: "In-case" }
      ]
    },
    {
      question: "Stream sniping / using stream info IC is:",
      answers: [
        { content: "Allowed with consent" },
        { content: "Not allowed (metagaming)", isCorrect: true },
        { content: "Allowed on weekends" },
        { content: "Allowed if off-duty" }
      ]
    },
    {
      question: "Which is MOST acceptable RP behavior?",
      answers: [
        { content: "Running at cops with fists while outnumbered 1 vs 6." },
        { content: "Faking surrender to draw gun without RP." },
        { content: "Evading while armed if there’s a realistic escape route.", isCorrect: true },
        { content: "Tasing suspects from moving car without emote." }
      ]
    }
  ],

  essayQuestions: [
    // === SET 1 ===
    "Describe a realistic robbery setup and execution. Include escalation, demands, and escape plan.",
    "Explain how you would avoid metagaming in a tense radio/Discord situation. Provide concrete steps.",

    // === SET 2 ===
    "Plan a hostage RP scenario at a bank. Cover server rules and roleplay plans.",
    "Outline how you'd keep OOC and IC comms separate when you're in a discord voice with other players.",

    // === SET 3 ===
    "Describe a police traffic stop RP from both officer and driver perspective.",
    "Explain your approach to conflicts that escalate to shots fired, including de-escalation.",

    // === SET 4 ===
    "Explain ERP and Disgusting RP rules on Revolt Roleplay.",
    "Explain how you would create a multi-week gang character storyline (goals, conflicts, outcomes).",

    // === SET 5 ===
    "Describe your character concept and long-term motivations (be specific).",
    "Explain ERP and Disgusting RP rules on Revolt Roleplay."
  ]
};
