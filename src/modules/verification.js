const axios = require('axios');
const config = require('../utils/config');

async function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('API key cannot be empty.');
  }

  const cleanKey = apiKey.trim();

  const response = await axios.get(`${config.torn.apiUrl}/key/`, {
    params: {
      key: cleanKey,
      selections: 'info'
    },
    timeout: 10000
  });

  const data = response.data;

  if (!data || typeof data.access_level === 'undefined') {
    throw new Error('Torn returned an invalid API response.');
  }

  // Full Access
  if (
    data.access_level === 4 &&
    data.access_type === 'Full Access'
  ) {
    return data;
  }

  // Custom API Key
  if (
    data.access_level === 0 &&
    data.access_type === 'Custom'
  ) {
    if (!data.selections || !data.selections.user) {
      throw new Error(
        'Your Custom API key does not contain the required user permissions.'
      );
    }

    // We only need profile information to identify
    // the Torn account during verification.
    if (!data.selections.user.includes('profile')) {
      throw new Error(
        'Your Custom API key must include the User Profile selection.'
      );
    }

    return data;
  }

  throw new Error(
    `Unsupported API key type: ${data.access_type || 'Unknown'}`
  );
}

async function getTornProfile(apiKey) {
  const response = await axios.get(`${config.torn.apiUrl}/user/`, {
    params: {
      key: apiKey,
      selections: 'profile'
    },
    timeout: 10000
  });

  const data = response.data;

  if (data.error) {
    throw new Error(data.error.error || 'Torn API request failed.');
  }

  if (!data.player_id || !data.name) {
    throw new Error(
      'Could not retrieve your Torn username and ID.'
    );
  }

  return {
    id: String(data.player_id),
    name: data.name
  };
}

async function verifyMember(member, apiKey) {
  const keyData = await validateApiKey(apiKey);
  const tornUser = await getTornProfile(apiKey);

  const botMember = member.guild.members.me;

  if (!botMember) {
    throw new Error('Unable to find the bot in this server.');
  }

  if (!botMember.permissions.has('ManageRoles')) {
    throw new Error(
      'The bot is missing the Manage Roles permission.'
    );
  }

  if (!botMember.permissions.has('ManageNicknames')) {
    throw new Error(
      'The bot is missing the Manage Nicknames permission.'
    );
  }

  const verifiedRole = member.guild.roles.cache.get(
    config.roles.verified
  );

  if (!verifiedRole) {
    throw new Error('The Verified role could not be found.');
  }

  if (
    verifiedRole.position >=
    botMember.roles.highest.position
  ) {
    throw new Error(
      'The bot role must be above the Verified role.'
    );
  }

  // Change nickname to:
  // TornUsername [TornID]
  await member.setNickname(
    `${tornUser.name} [${tornUser.id}]`
  );

  // Give Verified role
  await member.roles.add(verifiedRole);

  // Remove Unverified role
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
    keyData,
    tornUser
  };
}

module.exports = {
  validateApiKey,
  getTornProfile,
  verifyMember
};
