const { MessageEmbed } = require('discord.js');

const { AuthorizationError } = require('../../core/errors');
module.exports = {
    name: 'embed',
    description: 'The bot will say anything you want, but within embeds.',
    options: [{
        name: 'args',
        description: 'say anything',
        type: 'STRING',
        required: true,
    }],
    execute: async(client, interaction, args) => {
        args = interaction.options.getString('args');
        if (interaction.member.roles.cache.some((role) => role.name === 'Co-Manager' || role.name === 'MODERATOR')) {
            const EmbededMessage = new MessageEmbed()
                .setColor('0x00FF00')
                .setTitle(args);
            // replying with the Embeded message
            await interaction.reply({ embeds: [EmbededMessage] });
        } else {
            await new AuthorizationError(interaction);
        }
    },
};