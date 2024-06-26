import { getRandomIntBetween } from "@glimmer/utils";
import { NUM_AVATAR_IMGS } from "apps/dostoevsky/src/libs/constants";
import { User } from "apps/dostoevsky/src/types/user";

// Function to generate a random cool names inspired by Alan Gogoll's music
const generateName = () => {
	const adjetives = [
		"Sunlit",
		"Meadow",
		"Lakeside",
		"Windswept",
		"Mountain",
		"Rainforest",
		"Starlit",
		"Oceanic",
		"Tranquil",
		"Ethereal",
		"Golden",
		"Dewy",
		"Wild",
		"Whispering",
		"Enchanted",
		"Sapphire",
		"Gentle",
		"Twilight",
		"Aurora",
		"Serenading",
		"Apricot",
		"Wistful",
		"Crystal",
		"Majestic",
		"Soothing",
		"Mystical",
		"Magical",
		"Celestial",
		"Silent",
		"Velvet",
		"Glimmering",
		"Tender",
		"Vivid",
		"Nostalgic",
		"Ivory",
		"Lavender",
		"Jade",
		"Opal",
		"Topaz",
		"Pearl",
		"Graceful",
		"Silver",
		"Ruby",
		"Diamond",
		"Serene",
		"Dreamy",
		"Emerald",
		"Amber",
		"Opulent",
	];

	const nouns = [
		"Goldfish",
		"Ocean",
		"Moonlight",
		"Grove",
		"Valley",
		"Cascade",
		"Whisper",
		"Serenade",
		"Harmony",
		"Cascade",
		"Mist",
		"Reflection",
		"Breeze",
		"Enchantment",
		"Harbor",
		"Garden",
		"Song",
		"Vista",
		"Canopy",
		"Waves",
		"Lagoon",
		"Horizon",
		"Crescendo",
		"Lantern",
		"Meadow",
		"Brook",
		"Meadow",
		"Harmony",
		"Whisper",
		"Tranquility",
		"Serenity",
		"Echo",
		"Aurora",
		"Calm",
		"Eclipse",
		"Turtlebank",
		"Honeybee",
		"Sunrise",
		"Sunset",
		"Pumpkin",
		"Friday",
		"Bellflower",
		"Gingerbread",
		"Junedrop",
		"Cindermouse",
		"Strawberry",
		"Porridge",
		"Small",
		"Autumn",
		"Winter",
		"Spring",
		"Summer",
		"Giraffes",
		"Lions",
		"Burrows",
		"Fires",
		"Stars",
		"Sparrow",
		"Hill",
		"Circus",
		"Instruments",
		"Heart",
		"Melody",
		"Mouse",
		"Toad",
		"Eyes",
		"Parade",
		"Rain",
		"Feathers",
		"Leaves",
		"Fires",
		"Instruments",
		"Melody",
		"Light",
		"Melody",
		"Dance",
		"Melody",
		"Sunrise",
		"Lions",
		"Burrows",
		"Melody",
		"Frog",
		"Giraffes",
		"Melody",
		"Lantern",
		"Stars",
		"Moon",
		"Pines",
		"Melody",
		"Melody",
		"Sleepgarden",
		"Melody",
		"Lullaby",
		"Ocean",
		"Melody",
		"Sunrise",
		"Melody",
		"Melody",
		"Melody",
		"Ocean",
		"Melody",
		"Heart",
	];

	const adjectiveIdx = getRandomIntBetween(0, adjetives.length);
	const nounIdx = getRandomIntBetween(0, adjetives.length);

	return `${adjetives[adjectiveIdx]} ${nouns[nounIdx]}`;
};
export const generateRndUser = (): Omit<User, "id"> => ({
	name: generateName(),
	description: "",
	image: `/avatars/${getRandomIntBetween(0, NUM_AVATAR_IMGS)}.jpg`,
	links: [],
});
