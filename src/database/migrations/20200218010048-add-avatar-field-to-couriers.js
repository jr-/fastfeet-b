module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('couriers', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('couriers', 'avatar_id');
  },
};
