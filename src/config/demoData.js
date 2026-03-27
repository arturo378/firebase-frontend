// Static data used in demo mode — mirrors the Firebase collections structure.

function makeTimestamp(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(10, 0, 0, 0);
  return {
    toDate: () => new Date(date),
    Timestamp: new Date(date),
  };
}

export const DEMO_ASSETS = [
  // Companies
  { id: 'company1', type: 'company', name: 'Permian Basin Oil Co.', city: 'Midland', state: 'TX', zip: '79701', phone: '432-555-0100' },
  { id: 'company2', type: 'company', name: 'Eagle Ford Energy LLC', city: 'San Antonio', state: 'TX', zip: '78201', phone: '210-555-0200' },

  // Leases
  { id: 'lease1', type: 'lease', name: 'North Pad Alpha', company: 'company1' },
  { id: 'lease2', type: 'lease', name: 'South Pad Beta', company: 'company1' },
  { id: 'lease3', type: 'lease', name: 'Eagle West', company: 'company2' },

  // Wells
  { id: 'well1', type: 'well', name: 'Well 1-A', gps: '31.9686,-99.9018', description: 'Primary production well', lease: 'lease1', company: 'company1' },
  { id: 'well2', type: 'well', name: 'Well 1-B', gps: '31.9800,-99.8900', description: 'Secondary production well', lease: 'lease1', company: 'company1' },
  { id: 'well3', type: 'well', name: 'Well 2-A', gps: '31.9500,-99.9200', description: 'Production well', lease: 'lease2', company: 'company1' },
  { id: 'well4', type: 'well', name: 'Eagle West 1', gps: '29.4241,-98.4936', description: 'Main production', lease: 'lease3', company: 'company2' },

  // Warehouses
  { id: 'warehouse1', type: 'warehouse', name: 'Midland Central', warehousenumber: 'WH-001', areamanager: 'John Smith' },
  { id: 'warehouse2', type: 'warehouse', name: 'San Antonio South', warehousenumber: 'WH-002', areamanager: 'Maria Garcia' },

  // Chemicals
  { id: 'chem1', type: 'chemical', tradename: 'CorroShield X200', dottag: 'UN1760', weight: '450' },
  { id: 'chem2', type: 'chemical', tradename: 'ScaleGuard Pro', dottag: 'UN3267', weight: '220' },
  { id: 'chem3', type: 'chemical', tradename: 'BiocidePlus 500', dottag: 'UN2734', weight: '180' },
  { id: 'chem4', type: 'chemical', tradename: 'DemulsiFlo 300', dottag: 'UN1993', weight: '310' },

  // Pricing
  { id: 'price1', type: 'pricing', name: 'CorroShield X200', price: 12.50, company: 'company1' },
  { id: 'price2', type: 'pricing', name: 'ScaleGuard Pro', price: 8.75, company: 'company1' },
  { id: 'price3', type: 'pricing', name: 'BiocidePlus 500', price: 15.00, company: 'company2' },
  { id: 'price4', type: 'pricing', name: 'DemulsiFlo 300', price: 11.00, company: 'company1' },
];

export const DEMO_ASSET_DATA = [
  // Deliveries (spread across the past 7 days for the chart)
  { id: 'del1', type: 'delivery', datanumber: 'D-1001', date: makeTimestamp(1), company: 'Permian Basin Oil Co.', companyid: 'company1', lease: 'North Pad Alpha', well: 'Well 1-A', gps: '31.9686,-99.9018', comments: 'Routine corrosion treatment', createdBy: 'driver@demo.com', invoicenum: 'INV-2001', active: 1 },
  { id: 'del2', type: 'delivery', datanumber: 'D-1002', date: makeTimestamp(2), company: 'Permian Basin Oil Co.', companyid: 'company1', lease: 'North Pad Alpha', well: 'Well 1-B', gps: '31.9800,-99.8900', comments: 'Emergency scale treatment', createdBy: 'driver@demo.com', invoicenum: 'INV-2002', active: 0 },
  { id: 'del3', type: 'delivery', datanumber: 'D-1003', date: makeTimestamp(3), company: 'Eagle Ford Energy LLC', companyid: 'company2', lease: 'Eagle West', well: 'Eagle West 1', gps: '29.4241,-98.4936', comments: 'Standard biocide run', createdBy: 'driver2@demo.com', invoicenum: 'INV-2003', active: 1 },
  { id: 'del4', type: 'delivery', datanumber: 'D-1004', date: makeTimestamp(4), company: 'Permian Basin Oil Co.', companyid: 'company1', lease: 'South Pad Beta', well: 'Well 2-A', gps: '31.9500,-99.9200', comments: 'Bi-weekly demulsifier', createdBy: 'driver@demo.com', invoicenum: 'INV-2004', active: 1 },
  { id: 'del5', type: 'delivery', datanumber: 'D-1005', date: makeTimestamp(5), company: 'Permian Basin Oil Co.', companyid: 'company1', lease: 'North Pad Alpha', well: 'Well 1-A', gps: '31.9686,-99.9018', comments: 'Follow-up corrosion run', createdBy: 'driver2@demo.com', invoicenum: 'INV-2005', active: 1 },
  { id: 'del6', type: 'delivery', datanumber: 'D-1006', date: makeTimestamp(6), company: 'Eagle Ford Energy LLC', companyid: 'company2', lease: 'Eagle West', well: 'Eagle West 1', gps: '29.4241,-98.4936', comments: 'Biocide treatment', createdBy: 'driver@demo.com', invoicenum: 'INV-2006', active: 0 },

  // Delivery chemicals
  { id: 'dc1', type: 'delivery_chemical', deliveryid: 'del1', name: 'CorroShield X200', quantity: '50' },
  { id: 'dc2', type: 'delivery_chemical', deliveryid: 'del1', name: 'ScaleGuard Pro', quantity: '30' },
  { id: 'dc3', type: 'delivery_chemical', deliveryid: 'del2', name: 'BiocidePlus 500', quantity: '20' },
  { id: 'dc4', type: 'delivery_chemical', deliveryid: 'del3', name: 'CorroShield X200', quantity: '45' },
  { id: 'dc5', type: 'delivery_chemical', deliveryid: 'del4', name: 'DemulsiFlo 300', quantity: '60' },
  { id: 'dc6', type: 'delivery_chemical', deliveryid: 'del5', name: 'CorroShield X200', quantity: '35' },
  { id: 'dc7', type: 'delivery_chemical', deliveryid: 'del6', name: 'BiocidePlus 500', quantity: '25' },

  // Shipping papers
  { id: 'ship1', type: 'shipping_papers', datanumber: 'SP-001', date: makeTimestamp(1), createdby: 'driver@demo.com', originwarehousenumber: 'WH-001', destinationwarehousenumber: 'WH-002', trucknumber: 'TK-101', comments: 'Routine warehouse transfer', gps: '31.9686,-99.9018', active: 1 },
  { id: 'ship2', type: 'shipping_papers', datanumber: 'SP-002', date: makeTimestamp(4), createdby: 'driver2@demo.com', originwarehousenumber: 'WH-002', destinationwarehousenumber: 'WH-001', trucknumber: 'TK-202', comments: 'Return transfer', gps: '29.4241,-98.4936', active: 0 },

  // Shipping chemicals
  { id: 'sc1', type: 'shipping_chemical', shippingid: 'ship1', name: 'CorroShield X200', quantity: '100' },
  { id: 'sc2', type: 'shipping_chemical', shippingid: 'ship1', name: 'ScaleGuard Pro', quantity: '75' },
  { id: 'sc3', type: 'shipping_chemical', shippingid: 'ship2', name: 'DemulsiFlo 300', quantity: '60' },

  // Warehouse chemicals
  { id: 'wc1', type: 'warehouse_chemical', warehouseid: 'warehouse1', name: 'CorroShield X200', quantity: '200' },
  { id: 'wc2', type: 'warehouse_chemical', warehouseid: 'warehouse1', name: 'ScaleGuard Pro', quantity: '150' },
  { id: 'wc3', type: 'warehouse_chemical', warehouseid: 'warehouse2', name: 'BiocidePlus 500', quantity: '120' },
  { id: 'wc4', type: 'warehouse_chemical', warehouseid: 'warehouse2', name: 'DemulsiFlo 300', quantity: '80' },
];

export const DEMO_USERS = [
  { id: 'user1', username: 'jsmith', fullname: 'John Smith', email: 'jsmith@demo.com', status: '1', UID: 'uid1' },
  { id: 'user2', username: 'mgarcia', fullname: 'Maria Garcia', email: 'mgarcia@demo.com', status: '1', UID: 'uid2' },
  { id: 'user3', username: 'driver1', fullname: 'Driver One', email: 'driver@demo.com', status: '1', UID: 'uid3' },
  { id: 'user4', username: 'driver2', fullname: 'Driver Two', email: 'driver2@demo.com', status: '1', UID: 'uid4' },
];
