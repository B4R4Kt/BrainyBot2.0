module.exports = async (interaction, client) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return interaction.reply({content: 'No command found '});

  if (command.userPerms) {
    if (
      !client.guilds.cache
          .get(interaction.guild.id)
          .members.cache.get(interaction.member.id)
          .permissions.has(command.userPerms || [])
    ) {
      if (command.noUserPermsMessage) {
        return interaction.reply(command.noUserPermsMessage);
      } else if (!command.noUserPermsMessage) {
        return interaction.reply(
            `You need the \`${command.userPerms}\` `+
            `permission to use this command!`,
        );
      }
    }
  }

  if (command.botPerms) {
    if (
      !client.guilds.cache
          .get(interaction.guild.id)
          .members.cache.get(client.user.id)
          .permissions.has(command.botPerms || [])
    ) {
      if (command.noBotPermsMessage) {
        return interaction.reply(command.noBotPermsMessage);
      } else if (!command.noBotPermsMessage) {
        return interaction.reply(
            `I need the \`${command.userPerms}\` `+
            `permission to execute this command!`,
        );
      }
    }
  }

  const args = [];

  for (const option of interaction.options.data) {
    if (option.type === 'SUB_COMMAND') {
      if (option.name) args.push(option.name);
      option.options?.forEach((x) => {
        if (x.value) args.push(x.value);
      });
    } else if (option.value) args.push(option.value);
  }

  try {
    command.execute(client, interaction, args);
  } catch (e) {
    interaction.reply({content: e.message});
  }
};
