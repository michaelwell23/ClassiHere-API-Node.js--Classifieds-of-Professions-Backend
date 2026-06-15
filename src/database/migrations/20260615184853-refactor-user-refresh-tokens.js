'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_refresh_tokens', 'jti', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn('user_refresh_tokens', 'token_hash', {
      type: Sequelize.TEXT,
      allowNull: true,
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
    await queryInterface.removeIndex('user_refresh_tokens', 'idx_refresh_tokens_jti');
    await queryInterface.removeIndex('user_refresh_tokens', 'idx_refresh_tokens_user_id');
    await queryInterface.removeColumn('user_refresh_tokens', 'jti');
    await queryInterface.removeColumn('user_refresh_tokens', 'token_hash');
  },
};
