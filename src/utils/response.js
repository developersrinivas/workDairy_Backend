// src/utils/response.js
export function ok(res, data = null, message = 'OK') {
  return res.json({ success: true, message, data });
}

export function fail(res, message = 'Error', status = 400, data = null) {
  res.status(status).json({ success: false, message, data });
}
