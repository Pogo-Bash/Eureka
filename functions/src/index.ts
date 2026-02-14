import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Resend } from "resend";

admin.initializeApp();
const db = admin.firestore();

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a secure random token
function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Trigger: when a new student document is created
export const onStudentCreated = functions.firestore
  .document("students/{uid}")
  .onCreate(async (snap) => {
    const student = snap.data();

    // Only send if student requires parent approval
    if (!student.requiresParentApproval || !student.parentEmail) {
      return null;
    }

    const token = generateToken();
    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;
    const approvalUrl = `https://us-central1-${projectId}.cloudfunctions.net/approveParent?token=${token}&uid=${snap.id}`;

    // Store the approval token
    await db.collection("parentApprovals").doc(snap.id).set({
      token,
      parentEmail: student.parentEmail,
      studentName: `${student.firstName} ${student.lastName}`,
      studentUid: snap.id,
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      ),
    });

    // Send the email
    try {
      await resend.emails.send({
        from: "Eureka! <onboarding@resend.dev>",
        to: student.parentEmail,
        subject: `${student.firstName} wants to join Eureka!`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px;">
            <h1 style="color: #1b7e4f; font-size: 28px; margin-bottom: 4px;">Eureka!</h1>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

            <p style="font-size: 16px; color: #21242c; line-height: 1.6;">
              Hi there,
            </p>

            <p style="font-size: 16px; color: #21242c; line-height: 1.6;">
              <strong>${student.firstName} ${student.lastName}</strong> (age ${student.age}, ${student.grade}${gradeSuffix(student.grade)} grade)
              has signed up for <strong>Eureka!</strong>, an adaptive learning platform for students.
            </p>

            <p style="font-size: 16px; color: #21242c; line-height: 1.6;">
              Since they're under 13, we need your permission to activate their account.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${approvalUrl}" style="display: inline-block; background: #1b7e4f; color: white; font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                Approve ${student.firstName}'s Account
              </a>
            </div>

            <p style="font-size: 14px; color: #6d7278; line-height: 1.6;">
              This link expires in 7 days. If you didn't expect this email, you can safely ignore it.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">
              Eureka! — Learning that adapts to you
            </p>
          </div>
        `,
      });

      console.log(`Parent confirmation email sent to ${student.parentEmail} for student ${snap.id}`);
    } catch (error) {
      console.error("Failed to send parent email:", error);
    }

    return null;
  });

// HTTP endpoint: parent clicks approval link
export const approveParent = functions.https.onRequest(async (req, res) => {
  const { token, uid } = req.query;

  if (!token || !uid || typeof token !== "string" || typeof uid !== "string") {
    res.status(400).send(errorPage("Invalid approval link."));
    return;
  }

  try {
    const approvalDoc = await db.collection("parentApprovals").doc(uid).get();

    if (!approvalDoc.exists) {
      res.status(404).send(errorPage("Approval request not found."));
      return;
    }

    const approval = approvalDoc.data()!;

    if (approval.token !== token) {
      res.status(403).send(errorPage("Invalid token."));
      return;
    }

    if (approval.approved) {
      res.status(200).send(successPage(approval.studentName, true));
      return;
    }

    // Check expiry
    const expiresAt = approval.expiresAt.toDate();
    if (new Date() > expiresAt) {
      res.status(410).send(errorPage("This approval link has expired. Please ask your child to request a new one."));
      return;
    }

    // Approve the student
    await db.collection("students").doc(uid).update({
      parentConfirmed: true,
    });

    await db.collection("parentApprovals").doc(uid).update({
      approved: true,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send(successPage(approval.studentName, false));
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).send(errorPage("Something went wrong. Please try again."));
  }
});

function gradeSuffix(n: number): string {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

function successPage(studentName: string, alreadyApproved: boolean): string {
  const message = alreadyApproved
    ? `You've already approved ${studentName}'s account. They're all set!`
    : `${studentName}'s account has been approved! They can now start learning on Eureka.`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Account Approved — Eureka!</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f7f8fa; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: white; border-radius: 12px; padding: 48px 32px; max-width: 420px; text-align: center; border: 1px solid #d6d8db; }
        h1 { color: #1b7e4f; font-size: 24px; margin-bottom: 8px; }
        .check { font-size: 48px; margin-bottom: 16px; }
        p { color: #3c4043; font-size: 16px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="check">✅</div>
        <h1>Account Approved!</h1>
        <p>${message}</p>
      </div>
    </body>
    </html>
  `;
}

function errorPage(message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Error — Eureka!</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f7f8fa; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: white; border-radius: 12px; padding: 48px 32px; max-width: 420px; text-align: center; border: 1px solid #d6d8db; }
        h1 { color: #d92916; font-size: 24px; margin-bottom: 8px; }
        .icon { font-size: 48px; margin-bottom: 16px; }
        p { color: #3c4043; font-size: 16px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">⚠️</div>
        <h1>Oops</h1>
        <p>${message}</p>
      </div>
    </body>
    </html>
  `;
}
