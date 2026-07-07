function userResponseDTO(user) {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    avatar_url: user.avatar_path ? `/storage/${user.avatar_path}` : null,
    is_email_verified: user.is_email_verified,
    is_phone_verified: user.is_phone_verified,
    is_active: user.is_active,
    deactivated_at: user.deactivated_at,
    last_login_at: user.last_login_at,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

module.exports = userResponseDTO;
