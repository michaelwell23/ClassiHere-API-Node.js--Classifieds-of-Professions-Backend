const DeleteInactiveUsersJob = require('./DeleteInactiveUsersJob');

async function run() {
  try {
    const result = await DeleteInactiveUsersJob.execute();

    console.log(
      JSON.stringify({
        job: 'delete-inactive-users',
        success: true,
        ...result,
      })
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        job: 'delete-inactive-users',
        success: false,
        error: {
          name: error.name,
          message: error.message,
        },
      })
    );

    process.exitCode = 1;
  }
}

run();
