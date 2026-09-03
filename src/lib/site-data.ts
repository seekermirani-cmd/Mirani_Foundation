import heroHealth from "@/assets/hero-health.jpg";
import heroEducation from "@/assets/hero-education.jpg";
import heroJustice from "@/assets/hero-justice.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import teamDeepaRaikwad from "@/assets/team-deepa-raikwad.jpg";
import teamGovindRajbhar from "@/assets/team-govind-rajbhar.jpg";
import teamHanaMirani from "@/assets/team-hana-mirani.jpg";
import teamHareshMirani from "@/assets/team-haresh-mirani.jpg";
import teamYaminiBabani from "@/assets/team-yamini-babani.jpg";

// NOTE: The content JSON references dedicated photos for campaigns, blog
// posts (e.g. "campaign-feeding-hope.jpg") that are not yet available in
// this project. Until those real photos are supplied, the existing gallery
// and hero images are reused as placeholders so every card still renders.

export const heroSlides = [
  {
    image: heroHealth,
    eyebrow: "Health",
    title: "Care That Reaches Where It's Needed Most",
    subtitle:
      "From medical camps to mobility aid, we bring healing to doorsteps that healthcare often forgets.",
    cta: { label: "See our health work", href: "/blogs?category=Campaign" },
  },
  {
    image: heroEducation,
    eyebrow: "Education",
    title: "A Fair Start, For Every Child",
    subtitle:
      "Tuition support, mentorship and learning opportunities that turn a difficult beginning into a limitless future.",
    cta: { label: "Explore programs", href: "/about" },
  },
  {
    image: heroJustice,
    eyebrow: "Social Justice",
    title: "Dignity Isn't Given. It's Restored.",
    subtitle:
      "Standing beside marginalized communities with aid, advocacy and action — because everyone deserves to be seen.",
    cta: { label: "Join the movement", href: "/contact" },
  },
];

export const impactStats = [
  { label: "Campaigns", value: 3, suffix: "+" },
  { label: "Lives Affected", value: 5000, suffix: "+" },
  { label: "Stories Created", value: 20, suffix: "+" },
  { label: "Donors", value: 3, suffix: "+" },
];

export type Campaign = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Health" | "Education" | "Social Justice";
  image: string;
};

// Placeholder images (see note above) — real files: campaign-feeding-hope.jpg,
// campaign-citizens-cup.jpg, campaign-asha-mumbai.jpg
export const campaigns: Campaign[] = [
  {
    slug: "feeding-hope-mumbai-food-drive",
    title: "Feeding Hope: A Mumbai Food Drive",
    excerpt:
      "Over 40 meals distributed in under two minutes outside a Mumbai hotel — proof that a small act of kindness can ripple into something much bigger.",
    category: "Health",
    image: gallery1,
  },
  {
    slug: "kicking-towards-a-brighter-future",
    title: "Kicking Towards a Brighter Future",
    excerpt:
      "Mirani Foundation partnered with the Robin Hood Army's Citizens Cup, bringing water, ORS and encouragement to 200 underprivileged children at a Mumbai football tournament.",
    category: "Social Justice",
    image: gallery4,
  },
  {
    slug: "inspiring-a-brighter-future",
    title: "Inspiring a Brighter Future",
    excerpt:
      "Dr. Haresh and Hana Mirani visited ASHA Mumbai, spending time with students and championing their innovative greywater-recycling project.",
    category: "Education",
    image: gallery2,
  },
];

export const pillars = [
  {
    title: "Health",
    image: heroHealth,
    short:
      "A healthy body is the foundation of a healthy mind — and a healthy mind is what allows a community to grow.",
    long: "We support organizations delivering direct medical care to people who'd otherwise have none — from wheelchairs and mobility aid that restore independence, to medicines and checkups that reach people right where they live. Every act of care, however small, is aimed at building communities strong enough to thrive on their own terms.",
  },
  {
    title: "Education",
    image: heroEducation,
    short:
      "Poverty repeats itself when a child's postcode decides their future. We're here to break that cycle.",
    long: "We fund tuition, learning resources and educational infrastructure — including equipment for schools serving hearing-challenged students — for children in India and abroad. Every rupee spent here is an investment in someone who will go on to lift others up in turn.",
  },
  {
    title: "Social Justice",
    image: heroJustice,
    short: "Strong communities are inclusive ones — and inclusion has to be built, not assumed.",
    long: "Our work is about championing equality, tolerance and understanding — standing behind the initiatives, partnerships and grassroots organizations already doing this work on the ground, and giving them the resources to go further.",
  },
];

export const galleryImages = [
  { src: gallery1, caption: "Food drive, Pune district", campaign: "Monsoon Relief" },
  {
    src: gallery2,
    caption: "Learning Lamps classroom, Beed",
    campaign: "Learning Lamps Scholarship",
  },
  { src: gallery3, caption: "Free paediatric camp, Nashik", campaign: "Monsoon Medical Camp" },
  { src: gallery4, caption: "Women's tailoring cooperative", campaign: "Voices for Dignity" },
  { src: gallery5, caption: "Community sapling drive", campaign: "Green Villages" },
  { src: gallery6, caption: "Volunteers at the annual meet", campaign: "Volunteer Meet 2025" },
];

export const galleryCampaigns = [
  "All",
  "Monsoon Medical Camp",
  "Learning Lamps Scholarship",
  "Voices for Dignity",
  "Monsoon Relief",
  "Green Villages",
  "Volunteer Meet 2025",
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Campaign" | "Story" | "Press Release" | "Publication";
  date: string;
  image: string;
};

// Placeholder images (see note above) — real files: story-dr-haresh-mirani.jpg,
// story-kiva.jpg, story-hunger-india.jpg, press-release-1.jpg,
// publication-yaminis-journey.jpg
export const blogPosts: BlogPost[] = [
  {
    slug: "feeding-hope-mumbai-food-drive",
    title: "Feeding Hope: A Mumbai Food Drive",
    excerpt: "Over 40 meals distributed in under two minutes outside a Mumbai hotel.",
    content:
      "In the bustling streets of Mumbai, a city teeming with life and energy, there exists a stark contrast between the haves and have-nots. Amidst the towering skyscrapers and luxury hotels, countless individuals struggle to access even the most basic necessities, including food. It was against this backdrop that Dr. Mirani embarked on a mission to make a difference, one meal at a time.\n\nOutside a hotel in Mumbai, Dr. Mirani and his team set out to distribute food to those in need. The response was overwhelming, with over 40 meals being handed out in under two minutes — a stark reminder of the scale of need that exists in our society, and of how quickly it can be met when people show up.\n\nEach meal distributed represents more than just sustenance; it symbolizes hope, dignity, and a reminder that there are still good Samaritans in this world. By giving out meals, Dr. Mirani wasn't only addressing immediate hunger but also fostering a sense of community and solidarity. It's a small act, repeated often enough, that adds up to something much larger — and a reminder that even individual efforts can create a ripple effect of compassion that resonates far beyond the moment itself.",
    category: "Campaign",
    date: "2024-08-31",
    image: gallery1,
  },
  {
    slug: "kicking-towards-a-brighter-future",
    title: "Kicking Towards a Brighter Future",
    excerpt:
      "200 underprivileged children, one unforgettable football tournament — supported by the Mirani Foundation.",
    content:
      "The Mirani Foundation recently supported the Robin Hood Army's (RHA) Citizens Cup in Mumbai — a football tournament for underprivileged children, and a celebration of 10 years of RHA's work. By providing drinking water and ORS to the participating kids, we aimed to quench more than just their thirst: to nourish their dreams, and remind them that their well-being matters and their voices deserve to be heard.\n\nOn a sunny day in Mumbai, 200 underprivileged children gathered at the Airoli Euro School Turf, representing 10 RHA chapters from across the city. The venue's generous ground owner reduced costs to support the cause, and sponsors — including the Mirani Foundation — came together with goodies, caps and jerseys to make the day memorable.\n\nOur own foundation members, Govind and Yamini, were central to making the day happen — Govind working behind the scenes to keep everything running smoothly, and Yamini coordinating communications and donations with warmth and care. Their contributions reflect exactly the kind of collective kindness this event was built on.\n\nThe tournament was more than a sporting event — it was a platform for children from diverse backgrounds to showcase their talent, build teamwork and discipline, and simply have a day of unfiltered fun. As the Robin Hood Army and its supporters wrapped up the event, the shared takeaway was clear: together, we can create a world where every child has the opportunity to thrive.",
    category: "Campaign",
    date: "2024-08-29",
    image: gallery4,
  },
  {
    slug: "inspiring-a-brighter-future",
    title: "Inspiring a Brighter Future",
    excerpt: "Dr. Haresh and Hana Mirani visit ASHA Mumbai, championing student-led innovation.",
    content:
      "Dr. Haresh Mirani and his wife Hana Mirani recently visited ASHA Mumbai, a non-profit organization supported by the Mirani Foundation, spending quality time with students and listening closely to their visions for the future. The students, all beneficiaries of ASHA's educational initiatives, welcomed the couple with warmth and enthusiasm, sharing the experiences and opportunities their education has opened up.\n\nOne highlight of the visit was a student presentation on an innovative greywater recycling project, developed as part of a robotics program in Chennai. The students had been exploring sustainable ways to preserve water, focusing on both primary and secondary water cleaning — a showcase of real creativity applied to a real-world challenge.\n\nThrough these interactions, Dr. Mirani and his wife demonstrated their commitment to nurturing young talent and encouraging students to think big. The visit stood as a clear example of how education and mentorship, paired with genuine listening, can shape the next generation of changemakers — and a reminder that investing time is often as valuable as investing money.",
    category: "Campaign",
    date: "2024-08-31",
    image: gallery2,
  },
  {
    slug: "against-all-odds-dr-haresh-mirani",
    title: "Against All Odds: Dr. Haresh Mirani's Inspiring Life Story",
    excerpt:
      "From a refugee family displaced by Partition to founding the Mirani Trust — a story of resilience.",
    content:
      "Some stories don't begin with ambition — they begin with survival. Dr. Haresh Mirani's does.\n\nHis life took root in the shadow of the Partition of India. When British rule ended in 1947, the subcontinent split along religious lines, and the mass migrations that followed brought violence on a scale neither the departing British nor the new governments had anticipated. Haresh Mirani's parents were among those swept into this upheaval — fleeing Sindh as it became part of Pakistan, first finding shelter in a refugee camp outside Bombay, later settling in the crowded Mahim district.\n\nHis father, K. Mirani, took a clerical job with the Burmah/Shell organization and poured everything into one goal: his son's education. It came at real cost — money was tight, circumstances were hard — but it paid off. In 1979, Haresh graduated from Bombay University as a qualified doctor, just a year after his father's death. He married soon after and left for the United States, where three more years of requalification stood between him and practicing medicine — which he finally began in 1984.\n\nThe next twelve years were defined by discipline: Dr. Mirani built the largest, most successful medical practice in the Greater Knoxville area, alongside a strong investment portfolio. Then, in April 1996, a catastrophic car accident shattered his left ankle and ended the career he'd spent two decades building.\n\nThe recovery that followed — injury, denial, depression, anger, and eventually acceptance — taught him something his wealth couldn't: that material success held little long-term meaning. As a Hindu, he holds a deep belief in karma and the cycles of life, and when he noticed a positive mindset accelerating his physical healing, it opened a spiritual inquiry that eventually took him to the summit of Kilimanjaro — and from there, to founding the Mirani Trust, born from a determination to give back everything life had given him.",
    category: "Story",
    date: "2024-08-31",
    image: gallery3,
  },
  {
    slug: "why-kiva-touches-my-heart",
    title: "Why Kiva Touches My Heart",
    excerpt:
      "A reflection on childhood hardship, dignity, and why micro-lending resonates so deeply.",
    content:
      "There's a reason Dr. Mirani feels a personal pull toward Kiva, the platform connecting small lenders to entrepreneurs across the developing world — and it goes back to his own childhood.\n\nGrowing up, money in his household didn't always stretch to the end of the month. He remembers his father occasionally taking small loans to bridge the gap — loans that were always, meticulously, repaid. That memory of quiet financial dignity is exactly what he sees mirrored in Kiva's borrowers: not people asking for a handout, but for the means to improve their own situation.\n\nThe loans are often modest but transformative — a faster sewing machine for a woman growing her tailoring business, a cow or chickens for a farmer expanding into eggs and milk, a repair bill for a taxi driver's tuk-tuk. It was in meditation that Dr. Mirani landed on the philosophy that captures it best: \"I want to enable the poor without being an enabler.\"\n\nThis isn't abstract for him. In his travels he's visited many of the 90+ countries where Kiva operates — met taxi drivers in Kenya, goat farmers in India — people he's sat across from, not statistics on a screen. And the numbers back up what he's seen firsthand: Kiva reports a repayment rate above 94%, a striking testament to the work ethic of its borrowers.\n\nThe Mirani Foundation's own giving works differently — support with no expectation of repayment, aimed at the most vulnerable communities. But Kiva fills a gap neither banks nor most charities reach: the small entrepreneur working quietly and persistently to lift their family forward.",
    category: "Story",
    date: "2024-08-31",
    image: gallery5,
  },
  {
    slug: "combating-hunger-in-india",
    title: "A Heartfelt Mission to Combat Hunger in India",
    excerpt:
      "189 million undernourished, and a chance reunion that led to direct action in Nashik.",
    content:
      "India's economic growth over recent decades has been remarkable — but beneath that progress sits a hunger crisis of staggering scale. According to the India Foodbanking Network: 189.2 million people, roughly 14% of the population, face undernourishment; 20% of children under 5 are underweight; 34.7% suffer stunted growth; and 51.4% of women of reproductive age (15–49) battle anemia.\n\nThe COVID-19 pandemic made an already hard situation worse, stripping away livelihoods for millions through shutdowns, layoffs and lockdowns. It was in this climate that Dr. Haresh Mirani reconnected with an old school friend, social worker Kashiram Jashnani. That reunion became a turning point: Jashnani introduced Dr. Mirani to the depth of the hunger crisis unfolding in Nashik, Maharashtra, and out of that conversation, the Mirani Foundation was born.\n\nThrough Jashnani's on-the-ground efforts, the Foundation's first act of aid reached over 25 families at Puj Sindhi Panchayat, Deolali Camp, Nashik — delivering essential food, beds, and a wheelchair. It was never meant to be a one-off. Since then, social activists and organizations across India have approached the Foundation seeking support for marginalized communities, and the response has kept growing.\n\nAs Winston Churchill once put it: \"We make a living by what we get. We make a life by what we give.\" That's the principle the Mirani Foundation continues to operate by — expanding its reach one family, one community, at a time.",
    category: "Story",
    date: "2024-08-31",
    image: gallery6,
  },
  {
    slug: "mirani-foundation-continues-to-make-a-difference",
    title: "Mirani Foundation Continues to Make a Difference",
    excerpt: "A wheelchair, a photocopier, and a partnership built on showing up.",
    content:
      "On February 22, 2021, the Mirani Foundation partnered with Sardar Vallabhbhai Patel Seva Samiti (Gaints Group Anjar) on a mission built around two focused acts of support.\n\nAt St. Joseph Hospital, the Foundation donated a wheelchair to a patient named Jagaben, restoring a measure of independence and mobility that made a tangible difference to her daily life and care. Separately, in partnership with Mata Lachmi Rotary Foundation, a photocopier/xerox machine was donated to a respected school for hearing-challenged students in Gandhidham — a resource that directly strengthens the learning environment and gives students better tools to pursue their education with confidence.\n\nBoth gestures reflect the same underlying philosophy: meaningful change doesn't always require grand gestures — sometimes it's a wheelchair, sometimes it's a photocopier — but it always requires showing up. Through partnerships like this one, the Mirani Foundation continues building toward a more inclusive, better-supported community for the people it serves.",
    category: "Press Release",
    date: "2024-09-01",
    image: gallery1,
  },
  {
    slug: "a-year-of-giving-yaminis-journey",
    title: "A Year of Giving: Yamini's Journey with Mirani Foundation",
    excerpt:
      "A first-person reflection, one year into the work — on what giving actually teaches you.",
    content:
      "Completing a full year with the Foundation isn't just a reporting milestone — it's a moment worth sitting with. Looking back, there's real pride in what the Mirani Foundation family has built together in service of others.\n\nThere was a version of \"me\" before this work — a simple person with modest wants, average expectations, small goals. Content, but not like this. The shift wasn't about gaining something new; it was about learning something: that happiness has a practice, and that practice is giving, not getting.\n\nBefore this work, money felt like the thing standing between me and happiness. But money, it turns out, is only useful for making a living — not for making a life. It buys tools: a car to get somewhere, food for energy, clothes for warmth. Useful, yes. Happiness-producing, no. A pair of $2,500 shoes won't move the needle on joy — but $10 worth of bread handed to someone who needs it will, every time.\n\nReal happiness lives somewhere else entirely: in shared moments with people we love, meals eaten together, helping someone get what they're after, time in nature, music, dancing. The best things are free. And when there's money left over after covering what's genuinely needed, the wisest use of it is sharing it with someone who needs it more — a trip away might buy a few days of peace, but feeding hungry children buys something that lasts.\n\nThis isn't a rejection of enjoying life's pleasures — it's a case for balance, for prioritizing well. This reflection, more emotional journal than formal report by this point, captures a year's worth of projects — most of them carried out close to home.",
    category: "Publication",
    date: "2024-09-01",
    image: gallery2,
  },
];

export const teamMembers = [
  {
    name: "Haresh Mirani",
    role: "Founder",
    image: teamHareshMirani,
    quote:
      "We started this in a two-room clinic. A decade later, our belief is the same — dignity is not a service, it's a right.",
  },
  {
    name: "Hana Mirani",
    role: "Founder",
    image: teamHanaMirani,
    quote:
      "Every visit, every conversation reminds us why we started — the people we meet are the real teachers.",
  },
  {
    name: "Govind Rajbhar",
    role: "Director and Trustee",
    image: teamGovindRajbhar,
    quote:
      "The work behind the scenes is what makes the visible impact possible — every detail matters.",
  },
  {
    name: "Yamini Babani",
    role: "Director and Trustee",
    image: teamYaminiBabani,
    quote:
      "Real happiness comes from giving, not getting. Everything we do here is built on that belief.",
  },
  {
    name: "Deepa Raikwad",
    role: "Trustee",
    image: teamDeepaRaikwad,
    quote:
      "Every rupee we spend is a rupee someone trusted us with. That trust is the standard we hold ourselves to.",
  },
];

export const reports = [
  {
    title: "Report 1",
    year: 2026,
    type: "Word" as const,
    size: "Google Doc",
    href: "https://docs.google.com/document/d/1DGAAzvyiHFwiYqnLzX9ca7RteaK5_gFu/edit?usp=drivesdk&ouid=111740577265432819636&rtpof=true&sd=true",
  },
  {
    title: "Report 2",
    year: 2026,
    type: "Word" as const,
    size: "Google Doc",
    href: "https://docs.google.com/document/d/1Zok4HAlQGz5JDKYH8oGi_CeHnzADN3-3qrcR9bVnrAI/edit?usp=drivesdk",
  },
];

export const contactInfo = {
  phone: "+91 9322033429",
  email: "seekermirani@gmail.com",
  address: "204 Shivkrupa Apartment, Opp. IIT Main Gate, Powai, Mumbai, Maharashtra - 400076",
  mapUrl: "https://maps.app.goo.gl/1uJbzWaQjXMktNK8A?g_st=ac",
  bank: {
    accountName: "Seeker Mirani India Foundation",
    accountNumber: "023710200016232",
    accountType: "Current",
    ifsc: "IBKL0000237",
    bankName: "IDBI Bank",
    branchAddress: "Jheel Darshan, MHADA Complex, A.S. Marg, Powai, Mumbai, Maharashtra - 400076",
  },
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.982!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1700000000000",
};
