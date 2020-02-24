import {
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Courier from '../models/Courier';

class DeliveryPickedController {
  async update(req, res) {
    const { cid, did } = req.params;

    const courier = await Courier.findByPk(cid);
    if (!courier) {
      res.status(400).json({ error: "Courier doesnt exists." });
    }

    const delivery = await Delivery.findByPk(did);
    if (!delivery) {
      res.status(400).json({ error: "Delivery doesnt exists." });
    }

    const now = new Date();

    const deliveries = await Delivery.findAndCountAll({
      where: { courier_id: cid,
        start_date: {
          [Op.between]: [startOfDay(now), endOfDay(now)],
        },
      },
    });

    if (deliveries.count >= 5) {
      return res.status(200).json({
        error: "You have 5 opened deliveries.", deliveries: deliveries.row
      });
    }

    delivery.start_date = now;

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryPickedController();
