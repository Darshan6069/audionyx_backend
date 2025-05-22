const os = require('os');

function getCurrentIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  return (
    Object.values(networkInterfaces)
      .flat()
      .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address || 'localhost'
  );
}

module.exports = { getCurrentIpAddress };