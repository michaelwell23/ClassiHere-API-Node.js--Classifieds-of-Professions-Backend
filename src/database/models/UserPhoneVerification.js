const { Model, DataTypes } = require('sequelize');

class UserPhoneVerification extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },

        user_id: DataTypes.UUID,
        code: DataTypes.STRING,
        expires_at: DataTypes.DATE,
        verified_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'user_phone_verifications',
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

module.exports = UserPhoneVerification;
