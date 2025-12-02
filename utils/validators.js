/**
 * Input Validators
 * Validation functions for user input
 */

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain an uppercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain a number' };
  }
  return { valid: true, message: 'Password is strong' };
}

/**
 * Validate name
 */
export function validateName(name) {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  return { valid: true };
}

/**
 * Validate project name
 */
export function validateProjectName(name) {
  if (!name || name.trim().length < 3) {
    return { valid: false, message: 'Project name must be at least 3 characters' };
  }
  if (name.length > 50) {
    return { valid: false, message: 'Project name must not exceed 50 characters' };
  }
  return { valid: true };
}

/**
 * Validate task title
 */
export function validateTaskTitle(title) {
  if (!title || title.trim().length < 1) {
    return { valid: false, message: 'Task title cannot be empty' };
  }
  if (title.length > 200) {
    return { valid: false, message: 'Task title must not exceed 200 characters' };
  }
  return { valid: true };
}
