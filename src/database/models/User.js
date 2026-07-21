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

        first_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        last_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },

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
          allowNull: false,
          defaultValue: false,
        },

        is_phone_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },

        deactivated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        last_login_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        failed_login_attempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        locked_until: {
          type: DataTypes.DATE,
          allowNull: true,
        },
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

    this.hasMany(models.UserRefreshToken, {
      foreignKey: 'user_id',
      as: 'refreshTokens',
    });

    this.hasMany(models.UserTermAcceptance, {
      foreignKey: 'user_id',
      as: 'termAcceptances',
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
