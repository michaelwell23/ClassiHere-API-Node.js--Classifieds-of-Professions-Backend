'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },

      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true,
      },

      avatar_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      is_email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_phone_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      deactivated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      deletion_requested_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      failed_login_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      locked_until: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique',
    });

    await queryInterface.addIndex('users', ['cpf'], {
      unique: true,
      name: 'users_cpf_unique',
    });

    await queryInterface.addIndex('users', ['phone'], {
      unique: true,
      name: 'users_phone_unique',
    });

    await queryInterface.addIndex('users', ['deletion_requested_at'], {
      name: 'users_deletion_requested_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
