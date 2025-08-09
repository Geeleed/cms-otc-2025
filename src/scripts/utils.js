export const readIpAddress = async () =>
  await fetch("https://api.ipify.org?format=json")
    .then((r) => r.json())
    .then((r) => r.ip);
