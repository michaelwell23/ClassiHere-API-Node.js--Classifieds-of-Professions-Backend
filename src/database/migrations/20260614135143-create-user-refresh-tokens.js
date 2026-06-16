'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_refresh_tokens', {
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
      },

      jti: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      token_hash: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addIndex('user_refresh_tokens', ['jti'], {
      unique: true,
      name: 'idx_refresh_tokens_jti',
    });

    await queryInterface.addIndex('user_refresh_tokens', ['user_id'], {
      name: 'idx_refresh_tokens_user_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_refresh_tokens');
  },
};
