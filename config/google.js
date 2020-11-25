const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verify(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket;
  } catch (e) {
    return false; 
  }
}

async function getUserSub(ticket) {
  const payload = ticket.getPayload();

  return payload.sub;
}

module.exports = {
  verify,
  getUserSub,
};
