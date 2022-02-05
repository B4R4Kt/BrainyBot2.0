const { AuthorizationError } = require('../../core/errors');
module.exports = {
    name: 'say',
    description: 'The bot will say anything you want.',
    options: [{
        name: 'args',
        description: 'say anything',
        type: 'STRING',
        required: true,
    }],
    execute: async(client, interaction, args) => {
        args = interaction.options.getString('args');
        if (interaction.member.roles.cache.some((role) => role.name === 'Co-Manager' || role.name === 'MODERATOR')) {
            await interaction.reply(args);
        } else {
            await new AuthorizationError(interaction);
        }
    },
};