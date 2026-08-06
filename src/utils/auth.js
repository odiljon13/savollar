export const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin123'
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '1234567890'

export function saveCurrentUser(user) {
  localStorage.setItem('lqp_currentUser', JSON.stringify(user))
}

export function getCurrentUser() {
  const user = localStorage.getItem('lqp_currentUser')
  return user ? JSON.parse(user) : null
}

export function removeCurrentUser() {
  localStorage.removeItem('lqp_currentUser')
}

export function getRegisteredUsers() {
  const users = localStorage.getItem('lqp_registeredUsers')
  return users ? JSON.parse(users) : []
}

export function saveRegisteredUsers(users) {
  localStorage.setItem('lqp_registeredUsers', JSON.stringify(users))
}

export function addRegisteredUser(user) {
  const users = getRegisteredUsers()
  users.push(user)
  saveRegisteredUsers(users)
}

export function findUserByUsername(username) {
  const users = getRegisteredUsers()
  return users.find((u) => u.username === username)
}

export function encodePassword(password) {
  return btoa(password)
}

export function decodePassword(encoded) {
  return atob(encoded)
}

const users = getRegisteredUsers()
const adminExists = users.some((u) => u.username === ADMIN_USERNAME)

if (!adminExists) {
  const adminUser = {
    username: ADMIN_USERNAME,
    password: encodePassword(ADMIN_PASSWORD),
    firstName: 'Admin',
    lastName: 'User',
    isAdmin: true,
    createdAt: new Date().toISOString(),
  }
  addRegisteredUser(adminUser)
}
