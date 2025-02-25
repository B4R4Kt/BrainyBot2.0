const {MessageEmbed} = require('discord.js');
const {TECHPOINT_CHAT_CHANNEL_ID} = require('config.json');
const {sessionActive, addNote} = require('../../core/techpoint');
const {ephemeral} = require('../../utils/index');

module.exports = {
  name: 'note',
  description: 'Add a note',
  options: [{
    name: 'note',
    description: 'the content of the note',
    type: 'STRING',
    required: true,
  }],
  execute: async (client, interaction, args) => {
    const note = interaction.options.getString('note');

    if (!sessionActive()) {
      const errorembed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('ERROR ❌')
          .setDescription('a techpoint session must be active to take a note');

      const channel = interaction.client
          .channels.cache.get(techpoint_chat_channel_id);


      channel.send({embeds: [errorembed]});
    } else {
      if (interaction.channel.id !== TECHPOINT_CHAT_CHANNEL_ID) {
        await interaction.reply(ephemeral('You\'re at the wrong channel!'));
        return;
      }
      addNote(note, interaction.user.username);

      const succesembed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('NOTE ADDED')
          .setDescription(note);


      await interaction.reply({embeds: [succesembed]});
    }
  },

};
