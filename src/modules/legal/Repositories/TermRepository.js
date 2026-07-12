const Term = require('../../../database/models/Term');

class TermRepository {
  async findActive() {
    return Term.findOne({
      where: {
        is_active: true,
      },
    });
  }

  async findById(id) {
    return Term.findByPk(id);
  }
}

module.exports = new TermRepository();
