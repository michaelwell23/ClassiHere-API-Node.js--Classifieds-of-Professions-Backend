class ChangePasswordService {
  async execute() {
    return {
      message: 'Change password service ready',
    };
  }
}

module.exports = new ChangePasswordService();
