export default async function PasswordReset(email: string, user: string, resetlink: string): Promise<Record<string, unknown>> {
    const sgMail = require('@sendgrid/mail');
    const templateID = process.env.NODE_TEMPLATE_ID;
    sgMail.setApiKey(process.env.NODE_SENDGRID);

    const message = {
        from: 'darkinsog@gmail.com',
        to: email,
        templateId: templateID,
        dynamicTemplateData: {
            username: user,
            link: resetlink,
        },
    };
    try {
        await sgMail.send(message);
        return {status: "200", data: "Password reset message has been sent to your email."};
    } catch (err) {
        return {status: "500", data: err};
    }
}
