const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },

        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        phone: DataTypes.STRING,
        cpf: DataTypes.STRING,
        is_email_verified: DataTypes.BOOLEAN,
        is_active: DataTypes.BOOLEAN,
      },
      {
        sequelize,

        tableName: 'users',
        underscored: true,
        paranoid: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.UserVerification, {
      foreignKey: 'user_id',
      as: 'verifications',
    });
  }
}

module.exports = User;
