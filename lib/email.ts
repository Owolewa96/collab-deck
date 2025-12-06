// // import nodemailer from 'nodemailer';
// // import sgMail from '@sendgrid/mail';

// interface SendEmailOptions {
//   to: string;
//   subject: string;
//   html?: string;
//   text?: string;
// }

// function getAppUrl() {
//   return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
// }

// export async function sendEmail(opts: SendEmailOptions) {
//   const { to, subject, html, text } = opts;

//   const sendgridKey = process.env.SENDGRID_API_KEY;
//   if (sendgridKey) {
//     try {
//       sgMail.setApiKey(sendgridKey as string);
// Use lazy/dynamic imports so the module can load even if email packages
// are not installed in every environment (avoids top-level import errors).

interface SendEmailOptions {
	to: string;
	subject: string;
	html?: string;
	text?: string;
}

function getAppUrl() {
	return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
}

export async function sendEmail(opts: SendEmailOptions) {
	const { to, subject, html, text } = opts;

	const sendgridKey = process.env.SENDGRID_API_KEY;
	const from = process.env.EMAIL_FROM || `noreply@${new URL(getAppUrl()).hostname}`;

	if (sendgridKey) {
		try {
			const sgLib: any = (await import('@sendgrid/mail')).default || (await import('@sendgrid/mail'));
			sgLib.setApiKey(sendgridKey as string);
			const msg: any = { to, from, subject };
			if (html) msg.html = html;
			if (text) msg.text = text;
			const result = await sgLib.send(msg);
			return { success: true, provider: 'sendgrid', result };
		} catch (err) {
			// Log and fall through to SMTP fallback
			// eslint-disable-next-line no-console
			console.error('SendGrid SDK error', err);
		}
	}

	// Fallback to SMTP via nodemailer
	const host = process.env.SMTP_HOST;
	const port = process.env.SMTP_PORT;
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;

	if (!host || !port || !user || !pass) {
		// No email provider configured
		// eslint-disable-next-line no-console
		console.warn('No email provider configured (no SENDGRID_API_KEY and incomplete SMTP settings)');
		return { success: false, error: 'no-email-config' };
	}

	try {
		const nodemailerLib: any = (await import('nodemailer')).default || (await import('nodemailer'));
		const transporter = nodemailerLib.createTransport({
			host,
			port: Number(port),
			secure: Number(port) === 465,
			auth: { user, pass },
		});

		const info = await transporter.sendMail({ from, to, subject, html, text });
		return { success: true, provider: 'smtp', info };
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('SMTP send error', err);
		return { success: false, error: 'smtp-failed', details: err };
	}
}

export default sendEmail;
