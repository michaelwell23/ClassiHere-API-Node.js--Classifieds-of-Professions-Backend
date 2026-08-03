const environment = require('../../../config/environment');

function buildAvatarUrl(avatarPath) {
  if (!avatarPath) {
    return null;
  }

  const baseUrl = environment.appUrl.replace(/\/+$/, '');
  const normalizedPath = avatarPath.replace(/^\/+/, '');
  return `${baseUrl}/${normalizedPath}`;
}

function userResponseDTO(user) {
  if (!user) {
    return null;
  }

  const data = typeof user.toJSON === 'function' ? user.toJSON() : user;

  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    avatar_url: buildAvatarUrl(data.avatar_path),
    is_email_verified: data.is_email_verified,
    is_phone_verified: data.is_phone_verified,
    is_active: data.is_active,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

module.exports = userResponseDTO;
