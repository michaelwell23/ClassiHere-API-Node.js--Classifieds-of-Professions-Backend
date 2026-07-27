'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('password_reset_tokens', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.UUID,

        allowNull: false,

        references: {
          model: 'users',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      token_hash: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex('password_reset_tokens', ['user_id'], {
      name: 'password_reset_tokens_user_id_idx',
    });

    await queryInterface.addIndex('password_reset_tokens', ['expires_at'], {
      name: 'password_reset_tokens_expires_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('password_reset_tokens', 'idx_password_reset_tokens_user_id');

    await queryInterface.dropTable('password_reset_tokens');
  },
};
