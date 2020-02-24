import * as Yup from 'yup';

import Problem from '../models/Problem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      res.status(404).json({ error: 'Delivery doesnt exists.' });
    }

    const problems = await Problem.findAll({ where: {delivery_id: id}});

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if(!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      res.status(404).json({ error: 'Delivery doesnt exists.' });
    }

    const problemToSave = { ...req.body, delivery_id: id};

    const problem = await Problem.create(problemToSave);

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
