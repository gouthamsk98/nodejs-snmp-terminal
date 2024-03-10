const readline = require("readline");
const snmp = require("net-snmp");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getSessionConfig() {
  return new Promise((resolve, reject) => {
    rl.question(
      '\nEnter session type (Get or Set), or "exit" to quit: ',
      (type) => {
        if (type.toLowerCase() === "exit") {
          rl.close();
          return;
        }
        if (type.toLowerCase() !== "get" && type.toLowerCase() !== "set") {
          console.log("Invalid session type. Please enter Get, Set, or Exit.");
          resolve({});
          return;
        }
        rl.question("Enter session name: ", (name) => {
          rl.question("Enter OID: ", (oid) => {
            if (!oid.match(/^\d+(\.\d+)*$/)) {
              console.log("Invalid OID. Please enter a valid OID.");
              resolve({});
              return;
            }
            let session;
            if (type.toLowerCase() === "get") {
              session = snmp.createSession("localhost", "public");
              resolve({ session, oid });
            } else if (type.toLowerCase() === "set") {
              rl.question("Enter value: ", (value) => {
                session = snmp.createSession("127.0.0.1", "private");
                resolve({ session, oid, value });
              });
              return;
            }
          });
        });
      }
    );
  });
}

async function executeSession() {
  while (true) {
    try {
      const { session, oid, value } = await getSessionConfig();
      if (!session) {
        break; // Exit loop if user chooses to exit
      }

      const varbinds = [
        {
          oid: oid,
          type: snmp.ObjectType.OctetString,
          value: value || "user.name@domain.name",
        },
      ];

      if (value) {
        session.set(varbinds, function (error, varbinds) {
          console.log(varbinds);
          if (error) {
            console.error(error.toString());
          } else {
            for (var i = 0; i < varbinds.length; i++)
              console.log(varbinds[i].oid + "|" + varbinds[i].value);
          }
        });
      } else {
        session.get([oid], function (error, varbinds) {
          if (error) {
            console.error(error);
          } else {
            for (var i = 0; i < varbinds.length; i++) {
              if (snmp.isVarbindError(varbinds[i])) {
                console.error(snmp.varbindError(varbinds[i]));
              } else {
                console.log(varbinds[i].oid + " = " + varbinds[i].value);
              }
            }
          }
          session.close();
        });
      }
    } catch (err) {
      console.error(err);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  rl.close();
}

executeSession();
