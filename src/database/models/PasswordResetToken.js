const { Model } = require('sequelize');

class PasswordResetToken extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        user_id: DataTypes.UUID,
        token_hash: DataTypes.TEXT,
        expires_at: DataTypes.DATE,
        used_at: DataTypes.DATE,
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
