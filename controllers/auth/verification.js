const jwt = require("jsonwebtoken");
const db = require("../../models/user-model");
const mailer = require("../../mailer/mailer");
const path = require("path");
const userModel = require("../../models/user-model");
const { log } = require("console");
const HttpError = require("../../models/HttpError");
var error = new HttpError();
error.name = "verification";

async function verfication(req, res) {
  try{
    console.log("verification request received");

    var token = req.params.token;
    var vemail = await jwt.verify(token, process.env.verification_token_key);
  
    await db.findOneAndUpdate({ email: vemail }, { isvalid: true });
    res.sendFile(path.join(__dirname, "../../", "html-files/verified", "index.html"));
  }catch(err){
    next(error)
  }

}

async function sendverficationmail(email, name) {
  var mail = {
    to: email,
    subject: "Verify Your Mail Please",
    html: `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
    </head>
    <body>
        <h1>Dear User,</h1>
        <p>Thank you for creating an account with FED KIIT. We are excited to have you as a valued supporter of our community. To ensure the security of your account and provide you with the best experience, we kindly request your cooperation in verifying your email address.</p>
        <p>To complete the verification process, please click on the link below:</p>
        <p><a href='${
          process.env.server_address +
          "/auth/verification/" +
          jwt.sign(email, process.env.verification_token_key)
        }'>Verify Email Address</a></p>
        <p>Thank you for your cooperation. We look forward to serving you and providing you with a seamless experience on our platform.</p>
        <p>Connect with us now on:</p>
        <ul>
            <li><a href="https://instagram.com/fedkiit?igshid=MzRlODBiNWFlZA==">Instagram</a></li>
            <li><a href="https://www.linkedin.com/company/fedkiit/">LinkedIn</a></li>
            <li><a href="https://youtube.com/@federationkiit">YouTube</a></li>
        </ul>
        <p>Best regards,</p>
        <p>Team FED</p>
    </body>
    </html>`,
  };

  console.log(await mailer.sendMail(mail));
}

async function resendMail(req, res, next) {
  const { email } = req.params;
  try {
    var user = await userModel.find({ email: email }).exec();
    console.log(user);
    user.isvalid || sendverficationmail(user[0].email, user[0].name);
  } catch (err) {
    log(err);
    return res.status(500).send(err);
  }
  res.send("ok");
}
exports.verify = verfication;
exports.mail = sendverficationmail;
exports.resendMail = resendMail;
