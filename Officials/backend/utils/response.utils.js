export function formatResponse(data, message = 'Success') {
  return {
    success: true,
    data,
    message,
  };
}

export function formatError(message, code = null) {
  return {
    success: false,
    message,
    code,
  };
}
