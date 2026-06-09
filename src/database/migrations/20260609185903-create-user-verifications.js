'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_verifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: 'users',
          key: 'id',
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_verifications');
  },
};
