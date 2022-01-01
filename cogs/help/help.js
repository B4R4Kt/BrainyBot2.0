const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List of available commands:'),
    async execute(interaction) {
        const embedMess = new MessageEmbed()
        .setTitle('Available Commandes')
        .setColor(3447003);

        if (interaction.member.roles.cache.some(role => role.name === 'owner')) {
        //Grab owner commands & push it to commands_list
            const commandFiles = fs.readdirSync(`./cogs/owners`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../owners/${file}`)
                embedMess.addFields({
                        name:command.data.name,
                        value:command.data.description
                    }
                )
            }
        }

        if (interaction.member.roles.cache.some(role => role.name === 'mod')) {
            //Grab owner commands & push it to commands_list
            const commandFiles = fs.readdirSync(`./cogs/mods`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles){
                const command = require(`../mods/${file}`)
                embedMess.addFields({
                        name:command.data.name,
                        value:command.data.description
                    }
                )
            }
        }

        const cogs = ["general", "techpoint", "fun"]
        for (const cog of cogs) {
            const commandFiles = fs.readdirSync(`./cogs/${cog}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles){
                const command = require(`../${cog}/${file}`);
                embedMess.addFields({
                        name:command.data.name,
                        value:command.data.description
                    }
                )             
            }
        }

        await interaction.reply({
            embeds:[embedMess]
        });

    },
};