require("dotenv").config();
const Discord = require("discord.js");
const dns = require("dns");
const ping = require("ping");
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

bot.login(process.env.TOKEN);

bot.on("ready", () => {
	console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
	// Prevent bot from conversing with itself.
	if (msg.author == bot.user) {
		return;
	}

	if (msg.content.startsWith("!check")) {
		const myString = msg.content.split(" ");
		const url = myString[1];

		dns.lookup(url, (err) => {
			// Ensure url is valid
			if (err) {
				msg.reply(`DNS lookup failed for ${url}. Check URL for typos.`);
			} else {
				ping.promise
					.probe(url)
					.then((res) => {
						console.log(res);

						if (res["alive"] == true) {
							// Green embed
							var embed = createEmbed(
								"#00ff00",
								"Status Check",
								`:white_check_mark: Website is up.`
							);

							embed.addFields(
								{ name: "Host", value: res["host"] },
								{ name: "IP", value: res["numeric_host"], inline: true },
								{ name: "Ping", value: `${res["time"]} ms`, inline: true },
								{
									name: "Packet Loss",
									value: `${res["packetLoss"]}%`,
									inline: true,
								}
							);
							msg.reply({ embeds: [embed] });
						} else {
							// Red embed
							var embed = createEmbed(
								"#ff0000",
								"Status Check",
								`:x: Website appears to be down.`
							);

							embed
								.addFields(
									{ name: "Host", value: res["host"] },
									{ name: "IP", value: res["numeric_host"], inline: true },
									{ name: "Ping", value: `No response`, inline: true },
									{
										name: "Packet Loss",
										value: `${res["packetLoss"]}%`,
										inline: true,
									}
								)
								.setImage("https://i.imgur.com/6NfmQ.jpeg");
							msg.reply({ embeds: [embed] });
						}
					})
					.catch(() => {
						msg.reply(`Ping failed. Try again later.`);
					});
			}
		});
	} else if (msg.content.startsWith("!help")) {
		msg.channel.send("!check <url>");
	}
});

const createEmbed = (color, title, description) => {
	const newEmbed = new Discord.MessageEmbed();

	newEmbed.setColor(color).setTitle(title).setDescription(description);

	return newEmbed;
};
