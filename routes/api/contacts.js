const express = require("express");
const contactsMethods = require("../../models/contacts");
const Joi = require("joi");
const { HttpErrors } = require("../../helpers");

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const list = await contactsMethods.listContacts();
    res.json(list);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await contactsMethods.getContactById(contactId);

    if (!contact) {
      throw HttpErrors(404, "Not found, man");
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);

    if (error) {
      throw HttpErrors(400, error.message);
    }

    const newContact = await contactsMethods.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const delContact = await contactsMethods.removeContact(contactId);

    if (!delContact) {
      throw HttpErrors(404, "Not found");
    }

    res.json(delContact);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);

    if (error) {
      throw HttpErrors(400, error.message);
    }

    const { contactId } = req.params;

    const updContact = await contactsMethods.updateContact(contactId, req.body);

    if (!updContact) {
      throw HttpErrors(404, "Not found");
    }

    res.json(updContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
