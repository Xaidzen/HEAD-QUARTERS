const axios = require('axios');
const config = require('../utils/config');

async function validateApiKey(apiKey) {
  const response = await axios.get(
    `${config.torn.apiUrl}/key/`,
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
    throw new Error(data.error.error || 'Invalid Torn API key.');
  }

  if (
    data.access_type !== 'Full Access' &&
    data.access_type !== 'Custom'
  ) {
    throw new Error(
      'Please use a Full Access or Custom API key.'
    );
  }

  return data;
}

async function getTornProfile(apiKey) {
  const response = await axios.get(
    `${config.torn.apiUrl}/user/`,
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
    throw new Error(data.error.error || 'Unable to access Torn profile.');
  }

  if (!data.player_id || !data.name) {
    throw new Error('Torn username or ID could not be found.');
  }

  return {
    id: String(data.player_id),
    name: data.name
  };
}

async function verifyMember(member, apiKey) {
  await validateApiKey(apiKey);

  const tornUser = await getTornProfile(apiKey);

  const botMember = member.guild.members.me;

  if (!botMember.permissions.has('ManageRoles')) {
    throw new Error('Bot is missing Manage Roles permission.');
  }

  if (!botMember.permissions.has('ManageNicknames')) {
    throw new Error('Bot is missing Manage Nicknames permission.');
  }

  const verifiedRole = member.guild.roles.cache.get(
    config.roles.verified
  );

  if (!verifiedRole) {
    throw new Error('Verified role was not found.');
  }

  if (
    verifiedRole.position >=
    botMember.roles.highest.position
  ) {
    throw new Error(
      'The bot role must be above the Verified role.'
    );
  }

  await member.setNickname(
    `${tornUser.name} [${tornUser.id}]`
  );

  await member.roles.add(verifiedRole);

  const unverifiedRole = member.guild.roles.cache.get(
    config.roles.unverified
  );

  if (
    unverifiedRole &&
    member.roles.cache.has(unverifiedRole.id)
  ) {
    await member.roles.remove(unverifiedRole);
  }

  return {
    tornUser
  };
}

module.exports = {
  validateApiKey,
  getTornProfile,
  verifyMember
};
