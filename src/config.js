/**
 * Jediné místo, které se běžně upravuje.
 * Barvy, loga, video, statistiky, seznamy.
 *
 * Video: YouTube, Vimeo, nebo cesta k mp4 (třeba "/farewell.mp4" v /public).
 */

export const site = {
  colors: {
    bg: "#2a2723",
    ink: "#f7f3ea",
    muted: "#ddd4c6",
    yellow: "#FBEF7D",
    line: "rgba(247, 243, 234, 0.22)",
  },

  logos: {
    laba: "/logos/laba.png",
    skvot: "/logos/skvot.png",
    robotDreams: "/logos/robot-dreams.png",
  },

  video: {
    url: "https://www.youtube.com/watch?v=9R_0GYvhjQI",
    duration: "11:20",
  },

  meta: {
    brand: "Laba Czech Republic",
    years: "2022–2026",
    date: "30. 9. 2026",
    tag: "Final cut",
  },

  title: ["My exit interview,", "but make it", "cinematic"],

  subtitle: [
    "4,5 years. Too many parties.",
    "Questionable decisions. Excellent people.",
  ],

  stats: [
    { value: "4,5 years", label: "of lore" },
    { value: "1", label: "tattoo that requires context" },
    { value: "0", label: "regrets" },
  ],

  taking: [
    "excellent people",
    "questionable inside jokes",
    "unreasonable confidence that everything can be figured out",
    "approximately 900 screenshots",
    "actual friendships",
  ],

  leaving: [
    "“quick question”",
    "launch panic",
    "notifications",
    "final_final_v8_REAL files",
    "at least three unfinished Google Sheets",
  ],

}
