const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List of available commands:'),
    async execute(interaction) {
        
        const commands_list = [];

        if (interaction.member.roles.cache.some(role => role.name === 'owner')) {
            //Grab owner commands & push it to commands_list
            //absolute path C:/Users/client/GitHub/BrainyBot2.0/cogs/
            const commandFiles = fs.readdirSync(`./cogs/owners`).filter(file => file.endsWith('.js'));
            // const commandFiles = fs.readdirSync(`./owner`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles){
                const command = require(`./cogs/owners/${file}`)
                // const command = require(`./owner/${file}`);
                commands_list.push({
                    name:command.data.name, 
                    description:command.data.description });
            }
        }


        if (interaction.member.roles.cache.some(role => role.name === 'mod')) {
            //Grab owner commands & push it to commands_list
            //absolute path
            const commandFiles = fs.readdirSync(`./cogs/mods`).filter(file => file.endsWith('.js'));
            // const commandFiles = fs.readdirSync(`./mods`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles){
                const command = require(`./cogs/mods/${file}`)
                // const command = require(`./mods/${file}`);
                commands_list.push({
                    name:command.data.name, 
                    description:command.data.description });
            }
        }

        const cogs = ["general", "techpoint", "fun"]
        for (const cog of cogs) {
            // const commandFiles = fs.readdirSync(`./cogs/${cog}`).filter(file => file.endsWith('.js'));
            const commandFiles = fs.readdirSync(`./cogs/${cog}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles){
                const command = require(`./cogs/${cog}/${file}`);
                commands_list.push({
                    name:command.data.name, 
                    description:command.data.description});                
            }
        }

        let help_text = ""
        for (const command of commands_list){
            help_text += " \n" + `${command.name} : ${command.description}`;
        }

        await interaction.reply(help_text)
    },
};