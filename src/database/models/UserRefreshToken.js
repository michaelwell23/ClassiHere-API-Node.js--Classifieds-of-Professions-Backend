const { Model, DataTypes } = require('sequelize');

class UserRefreshToken extends Model {
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

        jti: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
        },

        token_hash: {
          type: DataTypes.TEXT,
          allowNull: false,
        },

        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'user_refresh_tokens',
        underscored: true,
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

module.exports = UserRefreshToken;
