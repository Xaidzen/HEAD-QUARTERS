const axios = require('axios');
const config = require('../utils/config');

async function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('API key is required.');
  }

  const cleanKey = apiKey.trim();

  const response = await axios.get(
    `${config.torn.apiUrl}/key/`,
    {
      params: {
        key: cleanKey,
        selections: 'info'
      }
    }
  );

  const data = response.data;

  if (!data || typeof data.access_level === 'undefined') {
    throw new Error('Torn returned an invalid response.');
  }

  if (
    data.access_level !== 4 &&
    data.access_type !== 'Full Access' &&
    data.access_type !== 'Custom'
  ) {
    throw new Error('Only Full Access or Custom API keys are accepted.');
  }

  return data;
}

async function getTornUser(apiKey) {
  const response = await axios.get(
    `${config.torn.apiUrl}/user/`,
    {
      params: {
        key: apiKey,
        selections: 'profile'
      }
    }
  );

  const data = response.data;

  if (!data || !data.player_id || !data.name) {
    throw new Error('Unable to retrieve your Torn profile.');
  }

  return {
    id: data.player_id,
    name: data.name
  };
}

async function verifyMember(member, apiKey) {
  const keyData = await validateApiKey(apiKey);
  const tornUser = await getTornUser(apiKey);

  const verifiedRole = member.guild.roles.cache.get(
    config.roles.verified
  );

  if (!verifiedRole) {
    throw new Error('Verified role was not found.');
  }

  if (!member.guild.members.me.permissions.has('ManageRoles')) {
    throw new Error('Bot is missing Manage Roles permission.');
  }

  if (!member.guild.members.me.permissions.has('ManageNicknames')) {
    throw new Error('Bot is missing Manage Nicknames permission.');
  }

  if (verifiedRole.position >= member.guild.members.me.roles.highest.position) {
    throw new Error('Bot role must be above the Verified role.');
  }

  await member.setNickname(
    `${tornUser.name} [${tornUser.id}]`
  );

  await member.roles.add(verifiedRole);

  const unverifiedRole = member.guild.roles.cache.get(
    config.roles.unverified
  );

  if (unverifiedRole && member.roles.cache.has(unverifiedRole.id)) {
    await member.roles.remove(unverifiedRole);
  }

  return {
    keyData,
    tornUser
  };
}

module.exports = {
  validateApiKey,
  getTornUser,
  verifyMember
};
