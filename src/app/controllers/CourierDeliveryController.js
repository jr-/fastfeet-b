import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Courier from '../models/Courier';

class CourierDeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { id, delivered } = req.params;

    const courier = await Courier.findByPk(id);
    if (!courier) {
      res.status(400).json({ error: "Courier doesnt exists"});
    }

    let deliveries;
    if (delivered) {
      deliveries = await Delivery.findAll({
        where: {
          courier_id: id,
          end_date: {
            [Op.ne]: null
          },
        },
        order: ['created_at'],
        limit: 20,
        offset: (page - 1) * 20,
        attributes: ['id', 'name', 'email'],
      });

    } else {
      deliveries = await Delivery.findAll({
        where: { courier_id: id, end_date: null, canceled_at: null },
        order: ['created_at'],
        limit: 20,
        offset: (page - 1) * 20,
        attributes: ['id', 'name', 'email'],
      });
    }

    return res.json(deliveries);
  }
}

export default new CourierDeliveryController();
