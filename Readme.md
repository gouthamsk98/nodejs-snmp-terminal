# Node.js SNMP Terminal Application

This is a Node.js terminal application that allows you to perform SNMP (Simple Network Management Protocol) operations such as Get and Set on a local SNMP agent.

## Installation

1. Clone the repository:

   ```
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```
   cd nodejs-snmp-terminal
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Run SNMP agent first (run with suda privilage ,so the node can bind to your system udp port 161):

   ```
   sudo node snmp_agent.js
   ```

5. Finally run the SNMP terminal app:

   ```
   node frontend_terminal.js
   ```

## Usage

To start the application, run the following command in your terminal:

Once the application is running, it will continuously prompt you for input to perform SNMP operations. Follow the prompts to specify the session type (Get or Set), session name, OID, and value (if applicable).

- **Get Operation**: Retrieves information from the SNMP agent using the specified OID.
- **Set Operation**: Sets a value for the specified OID on the SNMP agent.

**Note:**

- The "public" community string provides read access, allowing you to retrieve information from the SNMP agent.
- The "private" community string provides write access, allowing you to set values on the SNMP agent.

## Example

Here's an example of how you can interact with the application:

1. Enter session type (Get or Set): `Get`
2. Enter session name: `public`
3. Enter OID: `1.3.6.1.2.1.1.1.0`

This will retrieve and display the corresponding value associated with the provided OID.

## Code Explained

```js
var callback = function (error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
};
```

Defines a callback function to handle SNMP agent events, logging received data or errors.

```js
agent = snmp.createAgent(options, callback);
var authorizer = agent.getAuthorizer();
authorizer.addCommunity("public");
authorizer.addCommunity("private");
authorizer.addUser({
  name: "fred",
  level: snmp.SecurityLevel.noAuthNoPriv,
});
```

Creates an SNMP agent instance with specified options and callback function.
Retrieves an authorizer object to configure access control.
Configures community strings and users with specified security levels.

```js
var acm = authorizer.getAccessControlModel();
acm.setCommunityAccess("public", snmp.AccessLevel.ReadOnly);
acm.setCommunityAccess("private", snmp.AccessLevel.ReadWrite);
acm.setUserAccess("fred", snmp.AccessLevel.ReadWrite);
```

Sets access levels for communities and users.

```js
var myScalarProvider = {
  name: "sysDescr",
  type: snmp.MibProviderType.Scalar,
  oid: "1.3.6.1.2.1.1.1",
  scalarType: snmp.ObjectType.OctetString,
  maxAccess: snmp.MaxAccess["read-write"],
  handler: function (mibRequest) {
    mibRequest.done();
  },
};
```

Defines a scalar provider for the SNMP agent, specifying details such as name, OID (Object Identifier), data type, and access level.

## Author

[Goutham S Krishna](https://www.linkedin.com/in/goutham-s-krishna-21ab151a0/)<br/>
Software Engineer

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or create a pull request.
