import Contact from '../models/contact.model.js';
import { submitContactValidator } from '../validators/contact.validator.js';
import { sendContactAdminEmail, sendContactAutoReply } from '../../../shared/utils/sendEmail.util.js';
import {
  adminListValidator,
  updateStatusValidator,
  listContactsForAdmin,
} from '../services/contact.service.js';

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

export const getAdminContacts = async (req, res) => {
  try {
    const { error, value } = adminListValidator(req.query);
    if (error) return joiError(res, error);
    const result = await listContactsForAdmin(value);
    return res.status(200).json({
      success: true,
      message: 'Contacts fetched successfully',
      data: result.contacts,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: err.message,
    });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { error, value } = updateStatusValidator(req.body);
    if (error) return joiError(res, error);
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: value.status },
      { new: true }
    ).lean();
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Contact status updated',
      data: {
        id: contact._id,
        status: contact.status,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: err.message,
    });
  }
};
