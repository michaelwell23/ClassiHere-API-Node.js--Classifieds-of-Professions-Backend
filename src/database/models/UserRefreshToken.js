const { Model, DataTypes } = require('sequelize');

class UserRefreshToken extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        user_id: DataTypes.UUID,
        jti: DataTypes.UUID,
        token_hash: DataTypes.TEXT,
        expires_at: DataTypes.DATE,
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
