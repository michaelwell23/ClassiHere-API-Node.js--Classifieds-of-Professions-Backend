'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'user_verifications',
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
            onDelete: 'CASCADE',
          },

          token_hash: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true,
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
        },
        {
          transaction,
        }
      );

      await queryInterface.createTable(
        'user_phone_verifications',
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
            onDelete: 'CASCADE',
          },

          code_hash: {
            type: Sequelize.STRING(64),
            allowNull: false,
          },

          expires_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },

          attempts: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },

          verified_at: {
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
        },
        {
          transaction,
        }
      );

      await queryInterface.createTable(
        'user_refresh_tokens',
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
            onDelete: 'CASCADE',
          },

          jti: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
          },

          token_hash: {
            type: Sequelize.STRING(64),
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
        },
        {
          transaction,
        }
      );

      await queryInterface.createTable(
        'password_reset_tokens',
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
            onDelete: 'CASCADE',
          },

          token_hash: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true,
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
        },
        {
          transaction,
        }
      );

      await queryInterface.addIndex('user_verifications', ['expires_at'], {
        name: 'user_verifications_expires_at_idx',
        transaction,
      });

      await queryInterface.addIndex('user_phone_verifications', ['expires_at'], {
        name: 'user_phone_verifications_expires_at_idx',
        transaction,
      });

      await queryInterface.addIndex('user_refresh_tokens', ['user_id'], {
        name: 'user_refresh_tokens_user_id_idx',
        transaction,
      });

      await queryInterface.addIndex('user_refresh_tokens', ['expires_at'], {
        name: 'user_refresh_tokens_expires_at_idx',
        transaction,
      });

      await queryInterface.addIndex('password_reset_tokens', ['expires_at'], {
        name: 'password_reset_tokens_expires_at_idx',
        transaction,
      });

      await queryInterface.sequelize.query(
        `
          ALTER TABLE user_phone_verifications
          ADD CONSTRAINT user_phone_verifications_attempts_non_negative_check
          CHECK (attempts >= 0);

          CREATE INDEX user_verifications_pending_user_idx
          ON user_verifications (
            user_id,
            created_at DESC
          )
          WHERE used_at IS NULL;

          CREATE INDEX user_phone_verifications_pending_user_idx
          ON user_phone_verifications (
            user_id,
            created_at DESC
          )
          WHERE verified_at IS NULL;

          CREATE INDEX password_reset_tokens_pending_user_idx
          ON password_reset_tokens (
            user_id,
            created_at DESC
          )
          WHERE used_at IS NULL;
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
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('password_reset_tokens', {
        transaction,
      });

      await queryInterface.dropTable('user_refresh_tokens', {
        transaction,
      });

      await queryInterface.dropTable('user_phone_verifications', {
        transaction,
      });

      await queryInterface.dropTable('user_verifications', {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  },
};
