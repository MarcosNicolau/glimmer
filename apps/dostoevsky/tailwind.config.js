/** @type {import('tailwindcss').Config} */
import { join } from "path";
import { createGlobPatternsForDependencies } from "@nx/react/tailwind";
import preset from "../../libs/ui/web/tailwind.preset";

export default {
	content: [
		join(__dirname, "src/**/*!(*.stories|*.spec).{js,jsx,ts,tsx,html}"),
		...createGlobPatternsForDependencies(__dirname),
	],
	presets: [preset],
};
