const DJS = require('discord.js');

/**
 *
 * @param {*} msg
 * @return {*}
 */
const ephemeral = (msg) => {
  return {
    content: msg,
    ephemeral: true,
  };
};


/**
 * @param {DJS.Client} client
 * @param {DJS.DiscordAPIError | DJS.HTTPError | Error } error
 * @param {"warning" | "error"} type
 */
async function sendErrorLog(client, error, type) {
  try {
    if (
      error.message?.includes('Missing Access') ||
      error.message?.includes('Missing Permissions')
    ) {
      return;
    }

    if (
      error.stack?.includes?.(
          'DeprecationWarning: Listening to events on the Db class',
      )
    ) {
      return;
    }

    const {ERROR_LOGS_CHANNEL} = require('../../config.json');
    const channelId = ERROR_LOGS_CHANNEL;
    if (!channelId) {
      return client.logger.error('ERR_LOG', error?.stack || `${error}`);
    }

    const channel =
      client.channels.cache.get(channelId) ||
      (await client.channels.fetch(channelId));

    if (!channel || !havePermissions(channel)) {
      return client.logger.error('ERR_LOG', error?.stack || `${error}`);
    }

    const webhooks = await channel.fetchWebhooks();
    const hook = webhooks.first();

    if (!hook) {
      return client.logger.error('ERR_LOG', error?.stack || `${error}`);
    }

    const code = error.code || 'N/A';
    const httpStatus = error.httpStatus || 'N/A';
    const requestData = error.requestData ?? {json: {}};
    const name = error.name || 'N/A';
    let stack = error.stack || error;
    let jsonString;

    try {
      jsonString = JSON.stringify(requestData.json, null, 2);
    } catch {
      jsonString = '';
    }

    if (jsonString?.length >= 4096) {
      jsonString = jsonString ? `${jsonString?.substr(0, 4090)}...` : '';
    }

    if (typeof stack === 'object') stack = JSON.stringify(stack);

    if (typeof stack === 'string' && stack.length >= 4096) {
      console.error(stack);
      stack =
        'An error occurred but was too long'+
        'to send to Discord, check your console.';
    }

    const {codeBlock} = require('@discordjs/builders');

    const embed = new DJS.MessageEmbed()
        .setTitle('An error occurred')
        .addField('Name', name, true)
        .addField('Code', code.toString(), true)
        .addField('httpStatus', httpStatus.toString(), true)
        .addField('Timestamp', client.logger.now, true)
        .addField('Request data', codeBlock(jsonString?.substr(0, 1020)))
        .setDescription(`${codeBlock(stack)}`)
        .setColor(type === 'error' ? 'RED' : 'ORANGE');

    await hook.send({embeds: [embed]});
  } catch (e) {
    console.error({error});
    console.error(e);
  }
}

/**
 * Check if the client has the default permissions
 * @param {DJS.Interaction | DJS.TextChannel} resolveable
 * @return {boolean}
 */
function havePermissions(resolveable) {
  const ch = 'channel' in resolveable ? resolveable.channel : resolveable;
  if (ch instanceof DJS.ThreadChannel || ch instanceof DJS.DMChannel) {
    return true;
  }
  return (
    ch
        .permissionsFor(resolveable.guild.me)
        ?.has(DJS.Permissions.FLAGS.VIEW_CHANNEL) &&
    ch
        .permissionsFor(resolveable.guild.me)
        ?.has(DJS.Permissions.FLAGS.SEND_MESSAGES) &&
    ch
        .permissionsFor(resolveable.guild.me)
        ?.has(DJS.Permissions.FLAGS.EMBED_LINKS)
  );
}

/**
 * @param {string} str
 * @return {string}
 */
function toCapitalize(str) {
  if (str === null || str === '') {
    return false;
  } else {
    str = str.toString();
  }

  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * @param {number | string} n
 * @return {string}
 */
function formatNumber(n) {
  return Number.parseFloat(String(n)).toLocaleString('be-BE');
}

/**
 * @param {number} int
 * @return {string}
 */
function formatInt(int) {
  return int < 10 ? `0${int}` : int;
}

/**
 * Format duration to string
 * @param {number} millisec Duration in milliseconds
 * @return {string}
 */
function formatDuration(millisec) {
  if (!millisec || !Number(millisec)) return '00:00';
  const seconds = Math.round((millisec % 60000) / 1000);
  const minutes = Math.floor((millisec % 3600000) / 60000);
  const hours = Math.floor(millisec / 3600000);
  if (hours > 0) {
    return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
  }
  if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
  return `00:${formatInt(seconds)}`;
}

/**
 * d
 * @param {*} input
 * @return {number}
 */
function toMilliSeconds(input) {
  if (!input) return 0;
  if (typeof input !== 'string') return Number(input) || 0;
  if (input.match(/:/g)) {
    const time = input.split(':').reverse();
    let s = 0;
    for (let i = 0; i < 3; i++) {
      if (time[i]) {
        s += Number(time[i].replace(/[^\d.]+/g, '')) * Math.pow(60, i);
      }
    }
    if (time.length > 3) {
      s += Number(time[3].replace(/[^\d.]+/g, '')) * 24 * 60 * 60;
    }
    return Number(s * 1000);
  } else {
    return Number(input.replace(/[^\d.]+/g, '') * 1000) || 0;
  }
}

/**
 * Parse number from input
 * @param {*} input Any
 * @return {number}
 */
function parseNumber(input) {
  if (typeof input === 'string') {
    return Number(input.replace(/[^\d.]+/g, '')) || 0;
  }
  return Number(input) || 0;
}

/**
 *
 * @param {*} string
 * @param {*} extension
 * @return {string}
 */
function codeContent(string, extension = '') {
  return `\`\`\`${extension}\n${string}\`\`\``;
}

module.exports = {
  sendErrorLog,
  codeContent,
  parseNumber,
  toMilliSeconds,
  formatNumber,
  formatDuration,
  havePermissions,
  toCapitalize,
  formatInt,
  ephemeral,
};
