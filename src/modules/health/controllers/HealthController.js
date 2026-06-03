class HealthController {
  check(request, response) {
    return response.status(200).json({
      success: true,
      status: 'OK',
      timestamp: new Date(),
    });
  }
}

module.exports = new HealthController();
