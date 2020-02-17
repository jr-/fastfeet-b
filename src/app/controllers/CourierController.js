import * as Yup from 'yup';

import Courier from '../models/Courier';
import File from '../models/File';

class CourierController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const couriers = await Courier.findAll({
      where: { },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(couriers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    const courierJSON = JSON.parse(req.body.courier);

    if(!schema.isValid(courierJSON)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const courierExists = await Courier.findOne({ where: { email: courierJSON.email } });

    if (courierExists) {
      return res.status(400).json({ error: 'Courier already exists.' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    courierJSON.avatar_id = file.id;

    console.log(courierJSON);

    const { name: courierName, email } = await Courier.create(courierJSON);

    return res.json({courier: { name: courierName, email}});
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if(!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: "Courier doesn't exists." });
    }

    if (courier.email !== req.body.email) {
      const emailExists = await Courier.findOne({ where: {email: req.body.email}});

      if (emailExists) {
        return res.status(400).json({ error: "Courier email already taken"});
      }
    }

    const courierUpdated = await courier.update(req.body);

    return res.json(courierUpdated);

  }

  async delete(req, res) {
    const { id } = req.params;

    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(404).json({
        error: "This courier doesn't exists",
      });
    }

    await courier.destroy();

    return res.json();

  }
}

export default new CourierController();
