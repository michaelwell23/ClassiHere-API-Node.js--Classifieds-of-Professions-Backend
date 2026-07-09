'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_term_acceptances', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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

      term_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'terms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      accepted_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },

      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addConstraint('user_term_acceptances', {
      fields: ['user_id', 'term_id'],
      type: 'unique',
      name: 'user_term_unique_acceptance',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_term_acceptances');
  },
};
