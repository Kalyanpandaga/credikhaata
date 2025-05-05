const messagebird = require("messagebird");
const client = messagebird.initClient(process.env.MESSAGEBIRD_API_KEY);

const sendSMS = (to, message) => {
  return new Promise((resolve, reject) => {
    client.messages.create(
      {
        originator: "CrediKhata",
        recipients: [to],
        body: message,
      },
      (err, response) => {
        if (err) {
          console.error("MessageBird SMS failed:", err.errors || err.message);
          reject(err);
        } else {
          console.log("SMS sent via MessageBird:", response);
          resolve(response);
        }
      }
    );
  });
};

module.exports = { sendSMS };
