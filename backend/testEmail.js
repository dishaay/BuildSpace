require("dotenv").config();

const sendEmail = require("./utils/sendEmail");

sendEmail({
  to: "dishayadav432@gmail.com",
  subject: "Testing BuildSpace",
  html: `
    <h1>Hare Krishna!</h1>
    <p>Your email service is working.</p>
  `,
})

async function test() {
    try {
        const response = await sendEmail({
            to: "dishayadav432@gmail.com",
            subject: "BuildSpace Test Email",
            html: "<h1>If you see this, Resend works!</h1>",
        });

        console.log("SUCCESS");
        console.log(response);
    } catch (err) {
        console.log("ERROR");
        console.log(err);
    }
}

test();