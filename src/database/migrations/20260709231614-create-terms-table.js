'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('terms', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      version: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      document_path: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('terms');
  },
};
