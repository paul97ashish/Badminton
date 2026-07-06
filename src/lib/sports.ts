export interface Sport {
  slug: string;
  name: string;
  emoji: string;
}

// Curated categories of Toronto's drop-in offerings. Each category matches
// one or more "base titles" — the course title with qualifiers stripped
// (e.g. "Badminton with Family", "Badminton - Court" → "Badminton").
export const SPORTS: Sport[] = [
  { slug: "badminton", name: "Badminton", emoji: "🏸" },
  { slug: "basketball", name: "Basketball", emoji: "🏀" },
  { slug: "pickleball", name: "Pickleball", emoji: "🎾" },
  { slug: "table-tennis", name: "Table Tennis", emoji: "🏓" },
  { slug: "volleyball", name: "Volleyball", emoji: "🏐" },
  { slug: "soccer", name: "Soccer", emoji: "⚽" },
  { slug: "tennis", name: "Tennis", emoji: "🎾" },
  { slug: "ball-hockey", name: "Ball Hockey", emoji: "🏑" },
  { slug: "bocce", name: "Bocce", emoji: "🎳" },
  { slug: "dodgeball", name: "Dodgeball", emoji: "🤾" },
  { slug: "archery", name: "Archery", emoji: "🏹" },
  { slug: "ultimate", name: "Ultimate Frisbee", emoji: "🥏" },
  { slug: "netball", name: "Netball", emoji: "🏐" },
  { slug: "rock-climbing", name: "Rock Climbing", emoji: "🧗" },
  { slug: "multi-sport", name: "Multi-Sport", emoji: "🏅" },
  { slug: "open-gym", name: "Open Gym", emoji: "🏟️" },
  { slug: "roller-skating", name: "Roller Skating", emoji: "🛼" },
  { slug: "swimming", name: "Swimming", emoji: "🏊" },
  { slug: "aquatic-fitness", name: "Aquatic Fitness", emoji: "💧" },
  { slug: "skating", name: "Ice Skating", emoji: "⛸️" },
  { slug: "shinny", name: "Shinny Hockey", emoji: "🏒" },
  { slug: "yoga", name: "Yoga", emoji: "🧘" },
  { slug: "pilates", name: "Pilates", emoji: "🤸" },
  { slug: "zumba", name: "Zumba", emoji: "💃" },
  { slug: "tai-chi", name: "Tai Chi", emoji: "🥋" },
  { slug: "fitness", name: "Fitness", emoji: "💪" },
];

const BASE_TITLE_TO_SLUG: Record<string, string> = {
  Badminton: "badminton",
  Basketball: "basketball",
  Pickleball: "pickleball",
  "Table Tennis": "table-tennis",
  Volleyball: "volleyball",
  Soccer: "soccer",
  Tennis: "tennis",
  "Ball Hockey": "ball-hockey",
  Bocce: "bocce",
  Dodgeball: "dodgeball",
  Archery: "archery",
  Ultimate: "ultimate",
  Netball: "netball",
  "Rock Wall Climbing": "rock-climbing",
  "Multi-Sport": "multi-sport",
  "Open Gym": "open-gym",
  "Roller Skating": "roller-skating",
  "Lane Swim": "swimming",
  "Leisure Swim": "swimming",
  "Water Play": "swimming",
  "Adapted Leisure Swim": "swimming",
  "City Camp Swim": "swimming",
  "Aquatic Fitness": "aquatic-fitness",
  "Leisure Skate": "skating",
  "Figure Skating": "skating",
  "Ice Breakdancing": "skating",
  Shinny: "shinny",
  Yoga: "yoga",
  "Outdoor Yoga": "yoga",
  "Yoga/Pilates Fusion": "yoga",
  Pilates: "pilates",
  Zumba: "zumba",
  "Zumba Gold": "zumba",
  "Tai Chi": "tai-chi",
  "Outdoor Tai Chi": "tai-chi",
  Qigong: "tai-chi",
  Cardio: "fitness",
  "Cardio Dance": "fitness",
  "Cardio High/Low": "fitness",
  "Cycle Fit": "fitness",
  "Functional Fit": "fitness",
  "Gentle Fit": "fitness",
  HIIT: "fitness",
  Meditation: "fitness",
  "Mobility and Strength": "fitness",
  "Osteo Fit": "fitness",
  "Pedal and Strength": "fitness",
  Step: "fitness",
  "Strength and Conditioning": "fitness",
  "Walk Fit": "fitness",
  Walking: "fitness",
  "Walking/Running Track": "fitness",
  "Outdoor Walk Fit": "fitness",
  "Weight/Cardio Room": "fitness",
};

// Strip qualifiers: "Basketball (Women)", "Badminton with Family",
// "Badminton - Court", "Lane Swim: Older Adult" → their base title.
function baseTitle(courseTitle: string): string {
  let base = courseTitle.replace(/®/g, "");
  base = base.split(" (")[0];
  base = base.split(/ [Ww]ith /)[0];
  base = base.split(" - ")[0];
  base = base.split(":")[0];
  return base.trim();
}

export function sportSlugForTitle(courseTitle: string): string | null {
  return BASE_TITLE_TO_SLUG[baseTitle(courseTitle)] ?? null;
}

export function getSport(slug: string): Sport | null {
  return SPORTS.find((s) => s.slug === slug) ?? null;
}
