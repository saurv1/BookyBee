const sendEmail = require("../Services/sendEmail");
const contactModel = require("../model/contactModel");

const submitContactForm = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        if (!name || !phone || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Save to database
        const newContact = await contactModel.create({
            name,
            phone,
            email,
            message
        });

        const emailContent = `
            New Contact Form Submission:
            
            Name: ${name}
            Phone: ${phone}
            Email: ${email}
            Message: ${message}
        `;

        await sendEmail({
            email: "bookybee.service@gmail.com", // Recipient email
            subject: `Contact Form Submission from ${name}`,
            message: emailContent,
        });

        return res.status(200).json({
            message: "Message sent and saved successfully!",
            data: newContact
        });

    } catch (err) {
        console.error("Contact Form Error:", err);
        return res.status(500).json({ message: "Failed to process message. Please try again later." });
    }
};

module.exports = { submitContactForm };
