import { Op } from 'sequelize';

import Problem from '../models/Problem';
import Delivery from '../models/Delivery';

class ProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const problems = await Problem.findAll({
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['courier_id'],
          where: { canceled_at: null, end_date: null,
            start_date: { [Op.ne]: null }
          },
        }
      ]
    });

    return res.json(problems);

  }

  /**
   * TODO: Quando uma encomenda for cancelada, o entregador deve receber
   * um e-mail informando-o sobre o cancelamento.
   */
  async delete(req, res) {
    const { id } = req.params;

    const problem = await Problem.findByPk(id, {
      include: [
        {
          model: Delivery,
          as: 'delivery',
        },
      ]
    });

    problem.delivery.canceled_at = new Date();

    await problem.delivery.save();

    return res.json(problem);
  }
}

export default new ProblemController();
