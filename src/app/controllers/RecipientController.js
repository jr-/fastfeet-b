import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {

  async store(req, res) {
    if(!this.validation(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    if(!this.validation(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const recipientUpdated = await recipient.update(req.body);

    return res.json(recipientUpdated);
  }


  validation(recipient) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complementary_data: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      postal_code: Yup.string().required(),
    });

    return schema.isValid(recipient);
  }
}

export default new RecipientController();
