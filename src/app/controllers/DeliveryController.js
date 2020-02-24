import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';

import DeliveryMail from '../jobs/DeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {

  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: { end_date: null, canceled_at: null },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email'],
    });

    return res.json(deliveries);
  }

  async store(req, res) {

    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      courier_id: Yup.number().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const courier = await Courier.findByPk(req.body.courier_id);

    if (!courier) {
      return res.status(400).json({ error: "Courier doesn't exists." });
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: "Recipient doesn't exists." });
    }

    let delivery = await Delivery.create(
      req.body,
    );

    if (!delivery) {
      return res.status(500).json({ error: "Cannot store delivery." });
    }

    delivery = {
      ...delivery.dataValues,
      courier: courier.dataValues,
    };

    await Queue.add(DeliveryMail.key, {
      delivery,
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      courier_id: Yup.number(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery doesn't exists." });
    }

    const { recipient_id, courier_id } = req.body;

    if (recipient_id) {
      const recipient = await Recipient.findByPk(req.body.recipient_id);

      if (!recipient) {
        return res.status(400).json({ error: "Recipient doesn't exists." });
      }
    }

    if (courier_id) {
      const courier = await Courier.findByPk(req.body.courier_id);

      if (!courier) {
        return res.status(400).json({ error: "Courier doesn't exists." });
      }
    }

    const deliveryUpdated = await delivery.update(req.body);

    return res.json(deliveryUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery doesn't exists." });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

    /**
     * A data de início deve ser cadastrada assim que for feita a retirada do produto
     * pelo entregador, e as retiradas só podem ser feitas entre as 08:00 e 18:00h.
     * A data de término da entrega deve ser cadastrada quando o entregador finalizar a entrega:
     */

export default new DeliveryController();
