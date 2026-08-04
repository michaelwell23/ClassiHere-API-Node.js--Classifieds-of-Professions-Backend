'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'terms',
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
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
            type: Sequelize.STRING(500),
            allowNull: false,
          },

          is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },

          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },

          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        {
          transaction,
        }
      );

      await queryInterface.createTable(
        'user_term_acceptances',
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          user_id: {
            type: Sequelize.UUID,
            allowNull: false,

            references: {
              model: 'users',
              key: 'id',
            },

            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },

          term_id: {
            type: Sequelize.UUID,
            allowNull: false,

            references: {
              model: 'terms',
              key: 'id',
            },

            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
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
            type: Sequelize.DATE,
            allowNull: false,
          },

          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        {
          transaction,
        }
      );

      await queryInterface.addConstraint('user_term_acceptances', {
        fields: ['user_id', 'term_id'],
        type: 'unique',
        name: 'user_term_acceptances_user_term_unique',
        transaction,
      });

      await queryInterface.addIndex('user_term_acceptances', ['term_id'], {
        name: 'user_term_acceptances_term_id_idx',
        transaction,
      });

      await queryInterface.addIndex('user_term_acceptances', ['accepted_at'], {
        name: 'user_term_acceptances_accepted_at_idx',
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('user_term_acceptances', {
        transaction,
      });

      await queryInterface.dropTable('terms', {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  },
};
