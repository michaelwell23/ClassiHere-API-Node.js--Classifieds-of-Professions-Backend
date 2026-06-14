const { Model } = require('sequelize');

class UserRefreshToken extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        user_id: DataTypes.UUID,
        token: DataTypes.TEXT,
        expires_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'user_refresh_tokens',
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
