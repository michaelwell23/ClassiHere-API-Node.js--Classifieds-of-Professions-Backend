const DeleteInactiveUsersJob = require('./DeleteInactiveUsersJob');

(async () => {
  try {
    const result = await DeleteInactiveUsersJob.execute();

    console.log(result);

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
})();
