let store = null;

class Command {
  setTest(clb) {
    this._testClb = clb;
    return this;
  }

  setHandler(clb) {
    this._runClb = clb;
    return this;
  }

  run(msg, client) {
    return this._runClb(msg, client);
  }

  test(msg, client) {
    return this._testClb(msg, client);
  }
}

Command.setStorage = s => (store = s);
Command.add = () => {
  const c = new Command();
  store.commands.add(c);
  return c;
};

module.exports = Command;
