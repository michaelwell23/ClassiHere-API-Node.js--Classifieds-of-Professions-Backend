'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
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
            type: Sequelize.STRING(254),
            allowNull: false,
          },

          password_hash: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },

          phone: {
            type: Sequelize.STRING(20),
            allowNull: true,
          },

          avatar_path: {
            type: Sequelize.STRING(500),
            allowNull: true,
          },

          cpf: {
            type: Sequelize.STRING(11),
            allowNull: false,
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
          },

          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },

          deleted_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        {
          transaction,
        }
      );

      await queryInterface.addIndex('users', ['cpf'], {
        name: 'users_cpf_unique',
        unique: true,
        transaction,
      });

      await queryInterface.addIndex('users', ['phone'], {
        name: 'users_phone_idx',
        transaction,
      });

      await queryInterface.addConstraint('users', {
        fields: ['failed_login_attempts'],
        type: 'check',
        name: 'users_failed_login_attempts_non_negative_check',

        where: {
          failed_login_attempts: {
            [Sequelize.Op.gte]: 0,
          },
        },

        transaction,
      });

      await queryInterface.sequelize.query(
        `
          ALTER TABLE users
          ADD CONSTRAINT users_cpf_format_check
          CHECK (cpf ~ '^[0-9]{11}$');
        `,
        {
          transaction,
        }
      );

      await queryInterface.sequelize.query(
        `
          CREATE UNIQUE INDEX users_email_lower_unique
          ON users (LOWER(email));
        `,
        {
          transaction,
        }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
