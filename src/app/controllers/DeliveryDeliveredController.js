import Delivery from '../models/Delivery';
import File from '../models/File';
import Courier from '../models/Courier';

class DeliveryDeliveredController {
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

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const now = new Date();

    delivery.end_date = now;
    delivery.signature_id = file.id;

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryDeliveredController();
