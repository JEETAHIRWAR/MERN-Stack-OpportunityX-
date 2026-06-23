const ALLOWED_ROLES = new Set(["candidate", "recruiter", "admin"]);

/**
 * Persist only fields the frontend uses, preventing sensitive or unexpected
 * backend fields from reaching localStorage if the response expands later.
 */
export const sanitizeAuthUser = (user = {}) => {
  const safeUser = {
    _id: user._id ?? user.id ?? null,
    username: user.username ?? "",
    email: user.email ?? "",
    role: ALLOWED_ROLES.has(user.role) ? user.role : "candidate",
  };

  if (user.verificationStatus !== undefined) {
    safeUser.verificationStatus = user.verificationStatus;
  }

  if (user.accountStatus !== undefined) {
    safeUser.accountStatus = user.accountStatus;
  }

  if (user.emailVerified !== undefined) {
    safeUser.emailVerified = Boolean(user.emailVerified);
  }

  return safeUser;
};

/**
 * Auth endpoints return { token, user }. Legacy arguments remain supported so
 * an older caller cannot break while components use the canonical shape.
 */
export const normalizeAuthResponse = (authResponse, legacyToken) => {
  const token = authResponse?.token ?? legacyToken;
  const rawUser = authResponse?.user ?? authResponse;

  if (!token || !rawUser || typeof rawUser !== "object") {
    return null;
  }

  return {
    token,
    user: sanitizeAuthUser(rawUser),
  };
};

export const persistAuthSession = (
  authResponse,
  storage,
  legacyToken,
) => {
  const session = normalizeAuthResponse(authResponse, legacyToken);

  if (!session) {
    return null;
  }

  try {
    storage.setItem("token", session.token);
    storage.setItem("user", JSON.stringify(session.user));
    return session.user;
  } catch {
    return null;
  }
};

export const getRoleRedirect = (role) => {
  if (role === "recruiter") return "/recruiter/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/";
};
