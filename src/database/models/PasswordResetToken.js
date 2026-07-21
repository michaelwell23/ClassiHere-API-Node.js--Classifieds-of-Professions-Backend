const { Model, DataTypes } = require('sequelize');

class PasswordResetToken extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        token_hash: {
          type: DataTypes.TEXT,
          allowNull: false,
        },

        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        used_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'password_reset_tokens',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

module.exports = PasswordResetToken;
