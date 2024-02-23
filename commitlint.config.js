const config = {
	extends: ["@commitlint/config-conventional"],
	//Ignore bump messages for dependabot bump commits, sometimes creates headers longer than the character limit thus failing the workflow
	ignores: [(message) => message.includes("chore(release)")],
	rules: {
		"scope-enum": [
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			require("@commitlint/types").RuleConfigSeverity.Warning,
			"always",
			// List all the repo packages here
			["global", "gogol", "bulgakov", "dostoevsky", "libs"],
		],
	},
	prompt: {
		questions: {
			scope: {
				description: "Select the project",
				enum: {
					gogol: {
						description: "Voice server",
						title: "Gogol",
					},
					bulgakov: {
						description: "API server",
						title: "Bulgakov",
					},
					libs: {
						description: "any library change",
						title: "libs",
					},
				},
			},
		},
	},
};

module.exports = config;
