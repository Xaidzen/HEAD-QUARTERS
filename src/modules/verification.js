const axios = require('axios');
const config = require('../utils/config');

async function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('API key is required.');
  }

  const response = await axios.get(
    `${config.tornApiUrl}/key/`,
    {
      params: {
        key: apiKey.trim(),
        selections: 'info'
      },
      timeout: 10000
    }
  );

  const data = response.data;

  if (data.error) {
    throw new Error(
      data.error.error || 'Invalid Torn API key.'
    );
  }

  if (
    data.access_type !== 'Full Access' &&
    data.access_type !== 'Custom'
  ) {
    throw new Error(
      'Please use a valid Full Access or Custom API key.'
    );
  }

  return data;
}

async function getTornProfile(apiKey) {
  const response = await axios.get(
    `${config.tornApiUrl}/user/`,
    {
      params: {
        key: apiKey.trim(),
        selections: 'profile'
      },
      timeout: 10000
    }
  );

  const data = response.data;

  if (data.error) {
    throw new Error(
      data.error.error ||
      'Unable to retrieve your Torn profile.'
    );
  }

  if (!data.player_id || !data.name) {
    throw new Error(
      'Your Torn username or ID could not be found.'
    );
  }

  return {
    id: String(data.player_id),
    name: data.name
  };
}

async function verifyMember(member, apiKey) {
  await validateApiKey(apiKey);

  const tornUser = await getTornProfile(apiKey);

  const guild = member.guild;
  const botMember = guild.members.me;

  if (!botMember) {
    throw new Error(
      'The bot could not find itself in this server.'
    );
  }

  if (!botMember.permissions.has('ManageNicknames')) {
    throw new Error(
      'The bot needs the Manage Nicknames permission.'
    );
  }

  if (!botMember.permissions.has('ManageRoles')) {
    throw new Error(
      'The bot needs the Manage Roles permission.'
    );
  }

  const verifiedRole = guild.roles.cache.get(
    config.roles.verified
  );

  if (!verifiedRole) {
    throw new Error(
      'The Verified role could not be found.'
    );
  }

  if (
    verifiedRole.position >=
    botMember.roles.highest.position
  ) {
    throw new Error(
      'The bot role must be above the Verified role.'
    );
  }

  try {
    await member.setNickname(
      `${tornUser.name} [${tornUser.id}]`
    );
  } catch (error) {
    console.error(
      '[NICKNAME ERROR]',
      error
    );

    throw new Error(
      'I verified your Torn account, but I could not change your Discord nickname. Make sure the bot role is above your current role.'
    );
  }

  try {
    await member.roles.add(verifiedRole);
  } catch (error) {
    console.error(
      '[ROLE ERROR]',
      error
    );

    throw new Error(
      'Your Torn account was verified, but I could not give you the Verified role. Make sure the bot role is above the Verified role.'
    );
  }

  const unverifiedRole = guild.roles.cache.get(
    config.roles.unverified
  );

  if (
    unverifiedRole &&
    member.roles.cache.has(unverifiedRole.id)
  ) {
    await member.roles.remove(unverifiedRole).catch(error => {
      console.error(
        '[UNVERIFIED ROLE ERROR]',
        error
      );
    });
  }

  return tornUser;
}

module.exports = {
  validateApiKey,
  getTornProfile,
  verifyMember
};
