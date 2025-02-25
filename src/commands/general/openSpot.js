const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
const {AuthorizationError} = require('../../core/errors');
const {COMANAGERS_IDS} = require('../../../config.json');
const {setSpot, getSpot} = require('../../core/spot');

module.exports = {
  name: 'open_spot',
  description: 'open the spot if its closed or close it if opened',
  execute: async (client, interaction) => {
    // check if the user is a comanager, if not, throw an exception
    const userId = interaction.user.id;
    if (!COMANAGERS_IDS.includes(userId)) {
      new AuthorizationError(interaction);
      return;
    }

    // set the embed
    const replyEmbed = new MessageEmbed()
        .setAuthor('GDG Algiers Spot', 'https://www.gdgalgiers.com/static/phonelogo-db9c725b1463afd46d9b886076124bb2.png', 'https://goo.gl/maps/Xgcq2nossHZG4Guy9');
    const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('to_open')
                .setLabel('Set the spot to open')
                .setStyle('SUCCESS'),
        )
        .addComponents(
            new MessageButton()
                .setCustomId('to_closed')
                .setLabel('Set the spot to closed')
                .setStyle('DANGER'),
        );

    // if the spot is open
    if (getSpot()) {
      button.components[0].setDisabled(true);
      await interaction.reply({
        embeds: [replyEmbed.setDescription('The spot is currently **open**!')
            .setColor('GREEN'),
        ],
        ephemeral: true,
        components: [button],
      });
    } else {
      button.components[1].setDisabled(true);
      await interaction.reply({
        embeds: [replyEmbed.setDescription('The spot is currently **closed**!')
            .setColor('RED'),
        ],
        ephemeral: true,
        components: [button],
      });
    }

    // listen to button clicks
    const filter = (button) => (button.user.id === interaction.user.id);
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      max: 1,
      time: 60 * 1000,
    });
    collector.on('collect', async (button) => {
      await button.update({
        embeds: [replyEmbed.setDescription('The spot status is now updated!')
            .setColor('GREEN'),
        ],
        components: [],
        ephemeral: true,
      });
    });
    collector.on('end', async (collection) => {
      if (collection.first() === undefined) {
        await interaction.editReply({
          embeds: [replyEmbed.setDescription('**Time\'s up**.Please try again!')
              .setColor('RED'),
          ],
          components: [],
          ephemeral: true,
        });
        return;
      }
      if (collection.first().customId === 'to_open') {
        // set spot to open
        setSpot(true);
      } else
      if (collection.first().customId === 'to_closed') {
        // set spot to closed
        setSpot(false);
      }
    });
  },
};
