const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: DataTypes.STRING,
        avatar_path: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        cpf: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        is_email_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        deactivated_at: DataTypes.DATE,
        last_login_at: DataTypes.DATE,
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

    this.hasMany(models.PasswordResetToken, {
      foreignKey: 'user_id',
      as: 'passwordResetTokens',
    });

    this.hasMany(models.UserPhoneVerification, {
      foreignKey: 'user_id',
      as: 'phoneVerifications',
    });
  }

  toJSON() {
    const values = {
      ...this.get(),
    };

    delete values.password;

    return values;
  }
}

module.exports = User;
