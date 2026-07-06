const ChangeAccountStatusService = require('./ChangeAccountStatusService');

class ChangeAccountStatusController {
  async handle(request, response, next) {
    try {
      const { id } = request.validated.params;

      const action = request.path.endsWith('/deactivate') ? 'deactivate' : 'reactivate';

      const result = await ChangeAccountStatusService.execute({
        id,
        action,
      });

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ChangeAccountStatusController();
