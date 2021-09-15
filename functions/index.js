const functions = require("firebase-functions");
var nodemailer = require("nodemailer");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.SendEmail = functions.https.onCall((data, context) => {
  SendEmail(data.items, data.url);
  return {
    error: 0,
  };
});

const GetEmails = (items) => {
  let emails = new Set();
  Object.values(items).forEach((item) => {
    Object.values(item.neededBy).forEach((person) => {
      emails.add(person.email);
    });
  });
  return Array.from(emails);
};

const GetHtml = (items, url) => {
  let img =
    url === "n/a"
      ? "<p>No receipt attached</p>"
      : `<a href="${url}">View Receipt<a/>`;
  return `
    <div>
      ${items
        .map(
          (item) =>
            `<div key=${item.productName}>
          <b>${item.productName} </b> for
          <br/>
          ${item.neededBy
            .map((p) => `${p.name} (bought ${p.quantity})`)
            .join(", ")}
        </div>`
        )
        .join("</br>")}
      ${img}
    </div>
  `;
};

const SendEmail = (items, url) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "cs394onehouse2020@gmail.com",
      pass: "0neH0use2020",
    },
  });

  console.log("emails: ", GetEmails(items));

  var mailOptions = {
    from: "cs394onehouse2020@gmail.com",
    to: GetEmails(items),
    subject: "OneHouse Shopping Receipt",
    html: GetHtml(items, url),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
