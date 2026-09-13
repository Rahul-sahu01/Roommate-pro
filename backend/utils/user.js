export function profileCompletion(user) {
  let score = 35;

  if (user.name) score += 10;
  if (user.phone) score += 10;
  if (user.bio) score += 10;
  if (user.preferences?.budget) score += 10;
  if (user.preferences?.city) score += 8;
  if (user.preferences?.smoking) score += 5;
  if (user.preferences?.sleep) score += 5;
  if (user.preferences?.food) score += 7;

  return Math.min(100, score);
}

export function safeUser(user) {
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    verified: user.verified,
    preferences: user.preferences || {},
    profileCompletion: profileCompletion(user),
  };
}
