module.exports = function({bot, knex, logs, threads, config, commands}) {

	const isRgb = /^(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})$/;
	function parseColor(input) {
	    // Convert HEX to RGB
	    if (input.startsWith("#")) {
	      let r = 0,
	        g = 0,
	        b = 0;

	      // 3 digits
	      if (input.length == 4) {
	        r = "0x" + input[1] + input[1];
	        g = "0x" + input[2] + input[2];
	        b = "0x" + input[3] + input[3];

	        // 6 digits
	      } else if (input.length == 7) {
	        r = "0x" + input[1] + input[2];
	        g = "0x" + input[3] + input[4];
	        b = "0x" + input[5] + input[6];
	      }

	      input = `${+r}, ${+g}, ${+b}`;
	    }

	    // Convert RGB to INT or return null if invalid
	    const rgbMatch = input.match(isRgb);
	    if (rgbMatch) {
	      const r = parseInt(rgbMatch[1], 10);
	      const g = parseInt(rgbMatch[2], 10);
	      const b = parseInt(rgbMatch[3], 10);

	      if (r > 255 || g > 255 || b > 255) {
	        return null;
	      }

	      // Convert to int and return
	      return (r << 16) + (g << 8) + b;
	    }

	    return null;
	  }

	  let colorForEmbeds = "#5865f2"
	  let errorColorForEmbeds = "#FFCCCB"

	const actualSearchCommand = async (msg, args, thread) => {
		const userIdToSearch = args.userId

		if (isNaN(userIdToSearch)) return bot.createMessage(msg.channel.id, ":x: Invalid userID");

		let query;
		query = await knex
		.distinct("*")
		.from("thread_messages")
		.where("message_type", 4)

		var threadsFound = []
		var recentThreads = []
		var thirtyDayThreads = []
		var weekThreads = []
		var today = []

		for (const thread2 of query) {
			if (threadsFound.includes(thread2.thread_id)) continue;

			if (thread2.user_id == userIdToSearch) {
				threadsFound.push(thread2.thread_id)
				var timeStamp = new Date(Date.parse(thread2.created_at)).getTime()

				var now = new Date();
				var msBetweenDates = Math.abs(timeStamp - now.getTime());
				var daysBetweenDates = msBetweenDates / (24 * 60 * 60 * 1000);

				if (daysBetweenDates < 3) {
					recentThreads.push(thread2.thread_id)
				}
				if (daysBetweenDates < 7) {
					weekThreads.push(thread2.thread_id)
				}
				if (daysBetweenDates < 30) {
					thirtyDayThreads.push(thread2.thread_id)
				}
				if (daysBetweenDates < 1) {
					today.push(thread2.thread_id)
				}
			}
		}

		var user = bot.users.find((x) => x.id === userIdToSearch)

		if (!user) return bot.createMessage(msg.channel.id, ":x: Invalid userID");

		if (threadsFound.length == 0) {
			var embed = { description: "This user has responded to no threads.", color: parseColor(errorColorForEmbeds) };

			embed.author = {
			     name: user.username+"#"+user.discriminator,
			     icon_url: user.avatarURL,
			};

			bot.createMessage(msg.channel.id, { embeds:[embed] })
		} else {
			var embed = { description: "**--TICKET STATS--**\nAll time: #"+threadsFound.length+"\nLast 30 days: #"+thirtyDayThreads.length+"\nLast 7 days: #"+weekThreads.length+"\nLast 3 days: #"+recentThreads.length+"\nLast day: #"+today.length, color: parseColor(colorForEmbeds) };

			embed.author = {
			     name: user.username+"#"+user.discriminator,
			     icon_url: user.avatarURL,
			};

			bot.createMessage(msg.channel.id, { embeds:[embed] })
		}
	}

        commands.addInboxServerCommand('stats', [{ name: "userId", type: "string", required: true }],actualSearchCommand);
};
