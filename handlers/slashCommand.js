import fs from 'node:fs';
import chalk from 'chalk';
import { PermissionsBitField } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import AsciiTable from 'ascii-table';

let table = new AsciiTable().setHeading('Slash Commands', 'Stats').setBorder('|', '=', "0", "0");

const TOKEN = Bun.env.TOKEN;
const CLIENT_ID = Bun.env.CLIENT_ID;

const rest = new REST({ version: '10' }).setToken(TOKEN);

export default async (client) => {
    const slashCommands = [];
    const dirs = fs.readdirSync('./slashCommands/');

    await Promise.all(dirs.map(async (dir) => {
        const files = fs.readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

        await Promise.all(files.map(async (file) => {
            const module = await import(`../slashCommands/${dir}/${file}`);
            Object.values(module).forEach(slashCommand => {
                if (slashCommand.name) {
                    slashCommands.push({
                        name: slashCommand.name,
                        description: slashCommand.description,
                        type: slashCommand.type,
                        options: slashCommand.options ? slashCommand.options : null,
                        choices: slashCommand.choices ? slashCommand.choices : null,
                        default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
                        default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null,
                        contexts: slashCommand.contexts ? slashCommand.contexts : [0], // https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types
                    });
                    client.slashCommands.set(slashCommand.name, slashCommand);
                    table.addRow(file.split('.js')[0], '✅');
                } else {
                    table.addRow(file.split('.js')[0], '⛔');
                }
            });
        }));
    }));

    console.log(chalk.red(table.toString()));

    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: slashCommands }
            );
            console.log(chalk.yellow('Slash Commands • Registered'));
        } catch (error) {
            console.log(error);
        }
    })();
};