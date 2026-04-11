import { spawn } from "child_process";

const processes = [];
let shuttingDown = false;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function startProcess(label, command, args, options = {}) {
  const childProcess = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      ...options.env,
    },
  });

  processes.push({ label, childProcess });

  childProcess.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    for (const { childProcess: runningProcess } of processes) {
      if (!runningProcess.killed) {
        runningProcess.kill();
      }
    }

    const exitCode = signal ? 1 : code ?? 1;
    process.exit(exitCode);
  });

  return childProcess;
}

function shutdown() {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  for (const { childProcess } of processes) {
    if (!childProcess.killed) {
      childProcess.kill();
    }
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);

startProcess("back-end", npmCommand, ["--prefix", "back-end", "start"], {
  env: {
    PORT: "5001",
  },
});
startProcess("front-end", npmCommand, ["--prefix", "front-end", "run", "dev", "--", "--host", "0.0.0.0"]);
