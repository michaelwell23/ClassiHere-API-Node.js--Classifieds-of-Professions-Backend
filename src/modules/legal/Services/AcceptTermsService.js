const AppError = require('../../../shared/errors/AppError');

const TermRepository = require('../repositories/TermRepository');
const UserTermAcceptanceRepository = require('../repositories/UserTermAcceptanceRepository');

class AcceptTermsService {
  async execute({ userId, ipAddress, userAgent }) {
    const activeTerm = await TermRepository.findActive();

    if (!activeTerm) {
      throw new AppError('There is no active Terms of Use.', 404);
    }

    const acceptance = await UserTermAcceptanceRepository.findByUserAndTerm(userId, activeTerm.id);

    if (acceptance) {
      throw new AppError('The current Terms of Use have already been accepted.', 409);
    }

    await UserTermAcceptanceRepository.create({
      user_id: userId,
      term_id: activeTerm.id,
      accepted_at: new Date(),
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    return {
      message: 'Terms of Use accepted successfully.',
      version: activeTerm.version,
      accepted_at: new Date(),
    };
  }
}

module.exports = new AcceptTermsService();
