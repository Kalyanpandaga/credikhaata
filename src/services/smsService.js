const messagebird = require("messagebird")(process.env.MESSAGEBIRD_API_KEY);

const sendSMS = (to, message) => {
  return new Promise((resolve, reject) => {
    messagebird.messages.create(
      {
        originator: "CrediKhata",
        recipients: [to],
        body: message,
      },
      (err, response) => {
        if (err) {
          console.error("MessageBird SMS failed:", err.errors);
          return reject(err);
        }
        console.log("SMS sent via MessageBird:", response);
        resolve(response);
      }
    );
  });
};

module.exports = { sendSMS };
