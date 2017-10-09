'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('dates', 'dates_ibfk_1')
    await queryInterface.addConstraint('dates', ['habitId'], {
      type: 'FOREIGN KEY',
      name: 'dates_ibfk_1',
      references: {
        table: 'habits',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: (queryInterface, Sequelize) => {
  }
}
