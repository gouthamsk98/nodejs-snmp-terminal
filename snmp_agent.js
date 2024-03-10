const snmp = require("net-snmp");
// Default options
var options = {
  port: 161,
  disableAuthorization: false,
  accessControlModelType: snmp.AccessControlModelType.Simple,
  community: "public",
  engineID: "8000B98380XXXXXXXXXXXXXXXXXXXXXXXX", // where the X's are random hex digits
  address: null,
  transport: "udp4",
};

var callback = function (error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
};

agent = snmp.createAgent(options, callback);
var authorizer = agent.getAuthorizer();
authorizer.addCommunity("public");
authorizer.addCommunity("private");
authorizer.addUser({
  name: "fred",
  level: snmp.SecurityLevel.noAuthNoPriv,
});
var acm = authorizer.getAccessControlModel();
acm.setCommunityAccess("public", snmp.AccessLevel.ReadOnly);
acm.setCommunityAccess("private", snmp.AccessLevel.ReadWrite);
acm.setUserAccess("fred", snmp.AccessLevel.ReadWrite);
console.log(acm);
var myScalarProvider = {
  name: "sysDescr",
  type: snmp.MibProviderType.Scalar,
  oid: "1.3.6.1.2.1.1.1",
  scalarType: snmp.ObjectType.OctetString,
  maxAccess: snmp.MaxAccess["read-write"],
  handler: function (mibRequest) {
    // e.g. can update the MIB data before responding to the request here
    mibRequest.done();
  },
};
var mib = agent.getMib();
mib.registerProvider(myScalarProvider);
mib.setScalarValue("sysDescr", "MyAwesomeHost");
