const { AuthorizationError } = require('../../core/errors');
module.exports = {
    name: 'shutdown',
    description: 'Shutting down. Bye! :wave:',
    options: null,
    execute: async(client, interaction, args) => {
        if (interaction.member.roles.cache.some((role) => role.name === 'Co-Manager' || role.name === 'MODERATOR')) {
            await interaction.reply('Shutting down. Bye! :wave:');
            await interaction.client.destroy();
        } else {
            await new AuthorizationError(interaction);
        }
    },
};