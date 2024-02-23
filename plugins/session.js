const { randomUUID } = require('node:crypto')

const sessions = {}
module.exports = (
  { maxAge = 60 * 60 * 24 * 365 } = {}
) => (context, next) => {
  const { cookies } = context
  let sessionId = cookies.get('__Host-SESSION_ID')
  if (!sessionId || !sessions[sessionId]) {
    sessionId = randomUUID()
    sessions[sessionId] = {id: sessionId, destroy: () => cookies.delete(sessionId)}
    cookies.set('__Host-SESSION_ID', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge
    })
  }

  context.set('session', sessions[sessionId])

  next()
}