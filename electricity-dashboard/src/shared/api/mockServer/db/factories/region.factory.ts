import type { Region, City } from "@/entities/region/model/region.types";
import type { RegionId } from "@/shared/types/brand";
import { randomInt, randomFloat } from "@/shared/utils/numbers";

export interface ProvinceData {
  name: string;
  nameFA: string;
  code: string;
  lat: number;
  lng: number;
  cities: Array<{ name: string; nameFA: string; lat: number; lng: number; population: number }>;
}

export const IRAN_PROVINCES: ProvinceData[] = [
  {
    name: "Tehran", nameFA: "تهران", code: "TEH", lat: 35.6892, lng: 51.389,
    cities: [
      { name: "Tehran", nameFA: "تهران", lat: 35.6892, lng: 51.389, population: 9000000 },
      { name: "Karaj", nameFA: "کرج", lat: 35.8400, lng: 50.9391, population: 1970000 },
      { name: "Eslamshahr", nameFA: "اسلامشهر", lat: 35.5516, lng: 51.2351, population: 450000 },
      { name: "Varamin", nameFA: "ورامین", lat: 35.3247, lng: 51.6461, population: 250000 },
      { name: "Shahr-e Rey", nameFA: "شهر ری", lat: 35.5856, lng: 51.4349, population: 300000 },
    ],
  },
  {
    name: "Isfahan", nameFA: "اصفهان", code: "ISF", lat: 32.6546, lng: 51.668,
    cities: [
      { name: "Isfahan", nameFA: "اصفهان", lat: 32.6546, lng: 51.668, population: 2100000 },
      { name: "Kashan", nameFA: "کاشان", lat: 33.9850, lng: 51.4100, population: 400000 },
      { name: "Najafabad", nameFA: "نجف‌آباد", lat: 32.6340, lng: 51.3670, population: 280000 },
      { name: "Shahin Shahr", nameFA: "شاهین‌شهر", lat: 32.8561, lng: 51.5502, population: 170000 },
    ],
  },
  {
    name: "Fars", nameFA: "فارس", code: "FAR", lat: 29.5918, lng: 52.5837,
    cities: [
      { name: "Shiraz", nameFA: "شیراز", lat: 29.5918, lng: 52.5837, population: 1870000 },
      { name: "Marvdasht", nameFA: "مرودشت", lat: 29.8739, lng: 52.8024, population: 150000 },
      { name: "Jahrom", nameFA: "جهرم", lat: 28.5000, lng: 53.5500, population: 130000 },
      { name: "Fasa", nameFA: "فسا", lat: 28.9383, lng: 53.6486, population: 110000 },
    ],
  },
  {
    name: "Khorasan Razavi", nameFA: "خراسان رضوی", code: "KHR", lat: 36.2972, lng: 59.6067,
    cities: [
      { name: "Mashhad", nameFA: "مشهد", lat: 36.2972, lng: 59.6067, population: 3370000 },
      { name: "Neyshabur", nameFA: "نیشابور", lat: 36.2141, lng: 58.7962, population: 280000 },
      { name: "Sabzevar", nameFA: "سبزوار", lat: 36.2126, lng: 57.6819, population: 240000 },
      { name: "Torbat-e Heydarieh", nameFA: "تربت حیدریه", lat: 35.2740, lng: 59.2194, population: 150000 },
    ],
  },
  {
    name: "East Azerbaijan", nameFA: "آذربایجان شرقی", code: "EAZ", lat: 38.0800, lng: 46.2919,
    cities: [
      { name: "Tabriz", nameFA: "تبریز", lat: 38.0800, lng: 46.2919, population: 1740000 },
      { name: "Maragheh", nameFA: "مراغه", lat: 37.3900, lng: 46.2394, population: 180000 },
      { name: "Marand", nameFA: "مرند", lat: 38.4311, lng: 45.7686, population: 130000 },
      { name: "Bonab", nameFA: "بناب", lat: 37.3400, lng: 46.0561, population: 90000 },
    ],
  },
  {
    name: "West Azerbaijan", nameFA: "آذربایجان غربی", code: "WAZ", lat: 37.5527, lng: 45.0761,
    cities: [
      { name: "Urmia", nameFA: "ارومیه", lat: 37.5527, lng: 45.0761, population: 750000 },
      { name: "Khoy", nameFA: "خوی", lat: 38.5503, lng: 44.9521, population: 200000 },
      { name: "Mahabad", nameFA: "مهاباد", lat: 36.7631, lng: 45.7222, population: 170000 },
      { name: "Miandoab", nameFA: "میاندوآب", lat: 36.9697, lng: 46.1031, population: 130000 },
    ],
  },
  {
    name: "Khuzestan", nameFA: "خوزستان", code: "KHZ", lat: 31.3183, lng: 48.6706,
    cities: [
      { name: "Ahvaz", nameFA: "اهواز", lat: 31.3183, lng: 48.6706, population: 1300000 },
      { name: "Abadan", nameFA: "آبادان", lat: 30.3392, lng: 48.3043, population: 230000 },
      { name: "Dezful", nameFA: "دزفول", lat: 32.3836, lng: 48.4018, population: 260000 },
      { name: "Khorramshahr", nameFA: "خرمشهر", lat: 30.4403, lng: 48.1636, population: 170000 },
    ],
  },
  {
    name: "Kerman", nameFA: "کرمان", code: "KER", lat: 30.2839, lng: 57.0834,
    cities: [
      { name: "Kerman", nameFA: "کرمان", lat: 30.2839, lng: 57.0834, population: 740000 },
      { name: "Rafsanjan", nameFA: "رفسنجان", lat: 30.4067, lng: 55.9939, population: 160000 },
      { name: "Sirjan", nameFA: "سیرجان", lat: 29.4519, lng: 55.6803, population: 190000 },
      { name: "Jiroft", nameFA: "جیرفت", lat: 28.6767, lng: 57.7411, population: 130000 },
    ],
  },
  {
    name: "Alborz", nameFA: "البرز", code: "ALB", lat: 35.8400, lng: 50.9391,
    cities: [
      { name: "Karaj", nameFA: "کرج", lat: 35.8400, lng: 50.9391, population: 1970000 },
      { name: "Fardis", nameFA: "فردیس", lat: 35.7220, lng: 50.9831, population: 480000 },
      { name: "Nazarabad", nameFA: "نظرآباد", lat: 35.9511, lng: 50.6056, population: 70000 },
    ],
  },
  {
    name: "Qazvin", nameFA: "قزوین", code: "QAZ", lat: 36.2697, lng: 50.0049,
    cities: [
      { name: "Qazvin", nameFA: "قزوین", lat: 36.2697, lng: 50.0049, population: 580000 },
      { name: "Takestan", nameFA: "تاکستان", lat: 36.0693, lng: 49.6958, population: 100000 },
      { name: "Alvand", nameFA: "الوند", lat: 36.3167, lng: 49.1667, population: 50000 },
    ],
  },
  {
    name: "Gilan", nameFA: "گیلان", code: "GIL", lat: 37.2682, lng: 49.5891,
    cities: [
      { name: "Rasht", nameFA: "رشت", lat: 37.2682, lng: 49.5891, population: 680000 },
      { name: "Lahijan", nameFA: "لاهیجان", lat: 37.2100, lng: 50.0053, population: 100000 },
      { name: "Anzali", nameFA: "انزلی", lat: 37.4680, lng: 49.4628, population: 130000 },
      { name: "Astara", nameFA: "آستارا", lat: 38.4288, lng: 48.8721, population: 50000 },
    ],
  },
  {
    name: "Mazandaran", nameFA: "مازندران", code: "MAZ", lat: 36.5659, lng: 53.0586,
    cities: [
      { name: "Sari", nameFA: "ساری", lat: 36.5659, lng: 53.0586, population: 310000 },
      { name: "Babol", nameFA: "بابل", lat: 36.5414, lng: 52.6796, population: 250000 },
      { name: "Amol", nameFA: "آمل", lat: 36.4696, lng: 52.3503, population: 230000 },
      { name: "Qaemshahr", nameFA: "قائمشهر", lat: 36.4628, lng: 52.8606, population: 200000 },
    ],
  },
  {
    name: "Markazi", nameFA: "مرکزی", code: "MRK", lat: 34.0954, lng: 49.6985,
    cities: [
      { name: "Arak", nameFA: "اراک", lat: 34.0954, lng: 49.6985, population: 530000 },
      { name: "Saveh", nameFA: "ساوه", lat: 35.0211, lng: 50.3564, population: 220000 },
      { name: "Khomein", nameFA: "خمین", lat: 33.6422, lng: 50.0789, population: 90000 },
    ],
  },
  {
    name: "Hormozgan", nameFA: "هرمزگان", code: "HRM", lat: 27.1832, lng: 56.2666,
    cities: [
      { name: "Bandar Abbas", nameFA: "بندرعباس", lat: 27.1832, lng: 56.2666, population: 530000 },
      { name: "Minab", nameFA: "میناب", lat: 27.1047, lng: 57.0811, population: 80000 },
      { name: "Qeshm", nameFA: "قشم", lat: 26.9504, lng: 56.2710, population: 40000 },
    ],
  },
  {
    name: "Lorestan", nameFA: "لرستان", code: "LOR", lat: 33.4871, lng: 48.3558,
    cities: [
      { name: "Khorramabad", nameFA: "خرم‌آباد", lat: 33.4871, lng: 48.3558, population: 370000 },
      { name: "Borujerd", nameFA: "بروجرد", lat: 33.8974, lng: 48.7517, population: 260000 },
      { name: "Dorud", nameFA: "دورود", lat: 33.4933, lng: 49.0575, population: 100000 },
    ],
  },
  {
    name: "Sistan-Baluchestan", nameFA: "سیستان و بلوچستان", code: "SBL", lat: 29.4963, lng: 60.8629,
    cities: [
      { name: "Zahedan", nameFA: "زاهدان", lat: 29.4963, lng: 60.8629, population: 590000 },
      { name: "Chabahar", nameFA: "چابهار", lat: 25.2919, lng: 60.6428, population: 110000 },
      { name: "Zabol", nameFA: "زابل", lat: 31.0286, lng: 61.5011, population: 140000 },
      { name: "Iranshahr", nameFA: "ایرانشهر", lat: 27.2025, lng: 60.6847, population: 120000 },
    ],
  },
  {
    name: "Kurdistan", nameFA: "کردستان", code: "KRD", lat: 35.3219, lng: 46.9862,
    cities: [
      { name: "Sanandaj", nameFA: "سنندج", lat: 35.3219, lng: 46.9862, population: 410000 },
      { name: "Saqqez", nameFA: "سقز", lat: 36.2498, lng: 46.2736, population: 150000 },
      { name: "Marivan", nameFA: "مریوان", lat: 35.5175, lng: 46.1764, population: 100000 },
    ],
  },
  {
    name: "Hamadan", nameFA: "همدان", code: "HAM", lat: 34.7989, lng: 48.5150,
    cities: [
      { name: "Hamadan", nameFA: "همدان", lat: 34.7989, lng: 48.5150, population: 550000 },
      { name: "Malayer", nameFA: "ملایر", lat: 34.2967, lng: 48.8231, population: 180000 },
      { name: "Nahavand", nameFA: "نهاوند", lat: 34.1883, lng: 48.3753, population: 80000 },
    ],
  },
  {
    name: "Kermanshah", nameFA: "کرمانشاه", code: "KSH", lat: 34.3142, lng: 47.065,
    cities: [
      { name: "Kermanshah", nameFA: "کرمانشاه", lat: 34.3142, lng: 47.065, population: 950000 },
      { name: "Eslamabad-e Gharb", nameFA: "اسلام‌آباد غرب", lat: 34.1139, lng: 46.5281, population: 100000 },
      { name: "Kangavar", nameFA: "کنگاور", lat: 34.5044, lng: 47.9650, population: 50000 },
    ],
  },
  {
    name: "South Khorasan", nameFA: "خراسان جنوبی", code: "SKH", lat: 32.8505, lng: 59.2164,
    cities: [
      { name: "Birjand", nameFA: "بیرجند", lat: 32.8505, lng: 59.2164, population: 200000 },
      { name: "Qaen", nameFA: "قائن", lat: 33.7256, lng: 59.1842, population: 50000 },
      { name: "Ferdows", nameFA: "فردوس", lat: 34.0178, lng: 58.1728, population: 40000 },
    ],
  },
  {
    name: "North Khorasan", nameFA: "خراسان شمالی", code: "NKH", lat: 37.4747, lng: 57.3314,
    cities: [
      { name: "Bojnurd", nameFA: "بجنورد", lat: 37.4747, lng: 57.3314, population: 210000 },
      { name: "Shirvan", nameFA: "شیروان", lat: 37.3964, lng: 57.9258, population: 60000 },
      { name: "Esfarayen", nameFA: "اسفراین", lat: 37.0761, lng: 57.5106, population: 55000 },
    ],
  },
  {
    name: "Yazd", nameFA: "یزد", code: "YZD", lat: 31.8974, lng: 54.3569,
    cities: [
      { name: "Yazd", nameFA: "یزد", lat: 31.8974, lng: 54.3569, population: 530000 },
      { name: "Meybod", nameFA: "میبد", lat: 32.2500, lng: 54.0167, population: 80000 },
      { name: "Ardakan", nameFA: "اردکان", lat: 32.3103, lng: 54.0178, population: 70000 },
    ],
  },
  {
    name: "Qom", nameFA: "قم", code: "QOM", lat: 34.6401, lng: 50.8764,
    cities: [
      { name: "Qom", nameFA: "قم", lat: 34.6401, lng: 50.8764, population: 1200000 },
    ],
  },
  {
    name: "Zanjan", nameFA: "زنجان", code: "ZAN", lat: 36.6736, lng: 48.4787,
    cities: [
      { name: "Zanjan", nameFA: "زنجان", lat: 36.6736, lng: 48.4787, population: 430000 },
      { name: "Abhar", nameFA: "ابهر", lat: 36.1467, lng: 49.2181, population: 100000 },
      { name: "Khodabandeh", nameFA: "خدابنده", lat: 36.1206, lng: 48.5931, population: 50000 },
    ],
  },
  {
    name: "Semnan", nameFA: "سمنان", code: "SEM", lat: 35.5769, lng: 53.3953,
    cities: [
      { name: "Semnan", nameFA: "سمنان", lat: 35.5769, lng: 53.3953, population: 180000 },
      { name: "Shahroud", nameFA: "شاهرود", lat: 36.4183, lng: 54.9764, population: 150000 },
      { name: "Damghan", nameFA: "دامغان", lat: 36.1683, lng: 54.3500, population: 60000 },
    ],
  },
  {
    name: "Ardabil", nameFA: "اردبیل", code: "ARD", lat: 38.2498, lng: 48.2933,
    cities: [
      { name: "Ardabil", nameFA: "اردبیل", lat: 38.2498, lng: 48.2933, population: 530000 },
      { name: "Parsabad", nameFA: "پارس‌آباد", lat: 39.6492, lng: 47.9136, population: 100000 },
      { name: "Meshginshahr", nameFA: "مشگین‌شهر", lat: 38.3961, lng: 47.6806, population: 60000 },
    ],
  },
  {
    name: "Bushehr", nameFA: "بوشهر", code: "BSH", lat: 28.9234, lng: 50.8203,
    cities: [
      { name: "Bushehr", nameFA: "بوشهر", lat: 28.9234, lng: 50.8203, population: 220000 },
      { name: "Borazjan", nameFA: "برازجان", lat: 29.2627, lng: 51.2183, population: 110000 },
      { name: "Kangan", nameFA: "کنگان", lat: 27.8373, lng: 52.0567, population: 40000 },
    ],
  },
  {
    name: "Golestan", nameFA: "گلستان", code: "GOL", lat: 36.8427, lng: 54.4395,
    cities: [
      { name: "Gorgan", nameFA: "گرگان", lat: 36.8427, lng: 54.4395, population: 360000 },
      { name: "Gonbad-e Qabus", nameFA: "گنبدکاووس", lat: 37.2500, lng: 55.1667, population: 160000 },
      { name: "Aliabad-e Katul", nameFA: "علی‌آباد کتول", lat: 36.9081, lng: 54.8647, population: 60000 },
    ],
  },
  {
    name: "Ilam", nameFA: "ایلام", code: "ILM", lat: 33.6374, lng: 46.4227,
    cities: [
      { name: "Ilam", nameFA: "ایلام", lat: 33.6374, lng: 46.4227, population: 180000 },
      { name: "Dehloran", nameFA: "دهلران", lat: 32.6942, lng: 47.2681, population: 50000 },
      { name: "Mehran", nameFA: "مهران", lat: 33.1222, lng: 46.1744, population: 40000 },
    ],
  },
  {
    name: "Chaharmahal-Bakhtiari", nameFA: "چهارمحال و بختیاری", code: "CHB", lat: 32.3256, lng: 50.8644,
    cities: [
      { name: "Shahrekord", nameFA: "شهرکرد", lat: 32.3256, lng: 50.8644, population: 190000 },
      { name: "Borujen", nameFA: "بروجن", lat: 31.9681, lng: 51.2889, population: 50000 },
      { name: "Farsan", nameFA: "فارسان", lat: 32.2556, lng: 50.5633, population: 40000 },
    ],
  },
  {
    name: "Kohgiluyeh-Boyer-Ahmad", nameFA: "کهگیلویه و بویراحمد", code: "KBA", lat: 30.6598, lng: 51.6783,
    cities: [
      { name: "Yasuj", nameFA: "یاسوج", lat: 30.6598, lng: 51.6783, population: 130000 },
      { name: "Gachsaran", nameFA: "گچساران", lat: 30.3586, lng: 50.7989, population: 90000 },
      { name: "Dehdasht", nameFA: "دهدشت", lat: 30.7953, lng: 50.5647, population: 50000 },
    ],
  },
];

const statuses = ["healthy", "degraded", "critical", "offline"] as const;

function createCities(provinceCities: ProvinceData["cities"]): City[] {
  return provinceCities.map((c) => ({
    name: c.name,
    nameFA: c.nameFA,
    population: c.population,
    coordinates: { lat: c.lat, lng: c.lng },
    activeOutages: randomInt(0, 3),
  }));
}

export function createRegion(index: number): Region {
  const province = IRAN_PROVINCES[index % IRAN_PROVINCES.length];
  const activeOutages = randomInt(0, 8);

  return {
    id: `region_${index + 1}` as RegionId,
    name: province.name,
    nameFA: province.nameFA,
    code: province.code,
    status: statuses[index % statuses.length],
    reliabilityScore: randomFloat(85, 99.9),
    totalCustomers: randomInt(50000, 500000),
    activeOutages,
    totalOutages: activeOutages + randomInt(10, 100),
    avgResolutionTimeMinutes: randomInt(30, 300),
    coordinates: { lat: province.lat, lng: province.lng },
    cities: createCities(province.cities),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
