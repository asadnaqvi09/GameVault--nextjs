import Contact from '../models/contact.model.js';
import { submitContactValidator } from '../validators/contact.validator.js';
import { sendContactAdminEmail, sendContactAutoReply } from '../../../shared/utils/sendEmail.util.js';

const joiError = (res, error) =>
  res.status(400).json({
    success: false,
    message: error.details.map((e) => e.message).join(', ')
  });

export const submitContact = async (req, res) => {
  try {
    const { error, value } = submitContactValidator(req.body);
    if (error) return joiError(res, error);
    const contact = await Contact.create(value);
    await Promise.all([
      sendContactAdminEmail(contact),
      sendContactAutoReply(contact)
    ]);
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });
  } catch (err) {
    console.log('Error in Submit Contact Controller : ', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: err.message
    });
  }
};
