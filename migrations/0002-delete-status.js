module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Habits', 'deleted', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn('Dates', 'deleted', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Habits', 'deleted')
    await queryInterface.removeColumn('Dates', 'deleted')
  }
}
