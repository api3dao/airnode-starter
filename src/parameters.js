const util = require('./util');

module.exports = {
  providerId:
    util.readFromReceipt('providerId') || '0x23722bcdd23e559d7151db284f290fadde9f3cb725859d476ef1f16ab315355e',
  endpointId: '0xf466b8feec41e9e50815e0c9dca4db1ff959637e564bb13fefa99e9f9f90453c',
};
