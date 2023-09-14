# Self-hosted discord bot

## Contents
- [Self-hosted discord bot](#self-hosted-discord-bot)
  - [Contents](#contents)
  - [Installation](#installation)
    - [Docker](#docker)
  - [Usage](#usage)

## Installation

### Docker
1. Clone the repository
2. [Install Docker](https://docs.docker.com/get-docker/)
3. [Install Docker Compose](https://docs.docker.com/compose/install/)
4. Create file named `.env` in the root directory of the project
5. Paste the following code to the `.env` file
   ```bash
   TOKEN=
   CLIENT_ID=
   GOOGLE_API=
   MONGODB_URI=
   DB_NAME=<database name>
   ```
   1. Create name for the database and replace `<database name>` with it at `DB_NAME`
6. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
      1. Follow [MongoDB Atlas Getting Started](https://www.mongodb.com/docs/atlas/getting-started/)
      2. Copy the connection string for Node.js 4.1 or later and paste it to `MONGO_URI` in `.env` file
      3. Remember to replace `<password>` with the password you created for the user in the connection string

1. Create discord application and bot
   1. [Create application](https://discord.com/developers/applications)
      1. Click New Application in the upper right corner
      2. Enter a name for your app, then click Create.
   2. Create bot
      1. On the left hand sidebar click Bot, then the Add Bot button
      2. Update the username and icon for your bot
      3. Press `Reset Token` button to generate a new token
   3. Copy the bot token and paste it to `TOKEN` in `.env` file
   4. Navigate to the General Information page
      1. Copy the application id and paste it to `CLIENT_ID` in `.env` file
   5. [Create API Key to Google Custom Search Engine](https://developers.google.com/custom-search/v1/overview)
   6. Copy the API key and paste it to `GOOGLE_API` in `.env` file
2.  Invite the bot to your server
       1. Navigate to the OAuth2 page
       2. Select bot from the scopes
       3. Select the permissions you want to give the bot
       4. Copy the generated link and open it in your browser
       5. Select the server you want to add the bot to
       6. Click Authorize
3.  Configure presence of the bot
       1.  Open `json/config.json` file
       2.  There you can change bot's Activity status and message
       3.  Activity status: `online`, `idle`, `dnd` (do not disturb), `invisible`
       4.  To change bot's Activity type open `events/ready.js` file
           1.  In line 9 you can change the type of the Activity example ActivityType.Playing to ActivityType.Watching
           2.  Activity types are: `Playing`, `Streaming`, `Listening`, `Watching`, `Competing`

4.   To start the bot run the following command in the root directory of the project
```bash
docker compose up -d --no-deps --build
``` 


## Usage
1. To restart the bot run the following command in the root directory of the project
```bash
docker compose up -d --no-deps --build
```
2. To stop the bot run the following command in the root directory of the project
```bash
docker compose down
```
3. To add new commands
   1. Create new file in `commands` directory
   2. Copy the following code to the file

   ```js
   const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
   module.exports = {
      name: '',
      description: "",
      type: ApplicationCommandType.ChatInput,
      


      run: async (client, interaction) => {

      }

   };
   ```
   3. Replace `name` with the name of the command
   4. Replace `description` with the description of the command
   5. Add options if you want to under `type`
   ```js 
   options: [
        {
            name: '',
            description: '',
            required: true or false,
        }
    ],
   ```
   6. Put the code you want to execute when the command is called in the `run` function 
   
      [Discord.js documentation](https://discord.js.org/#/docs/discord.js/main/general/welcome)
      
      [Discord.js Guide](https://discordjs.guide/#before-you-begin)
   7. Save the file
   8. Restart the bot to apply the changes (see [Usage](#usage) step 1)
