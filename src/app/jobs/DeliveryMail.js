import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.courier.name} <${delivery.courier.email}>`,
      subject: 'Você tem uma nova entrega',
      template: 'delivery',
      context: {
        product: delivery.product,
        courier: delivery.courier.name,
      },
    });
  }
}

export default new DeliveryMail();
