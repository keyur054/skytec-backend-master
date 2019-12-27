var system = require("./../modules");
function getRoleTypeIds(slugs) {
  system.co(function*() {
    var roles = [];
    var roleTypes = yield system.db.roleType.find({ slug: { $in: slugs } });
    if (roleTypes) {
      roles = roleTypes.map(function(o) {
        return o._id;
      });
    }
    console.log("roles", roles);
    return roles;
  });
}
module.exports = {
  modalList: [
    "roleType",
    "role",
    "paymentTerms",
    "deliveryTerm",
    "qms",
    "sex",
    "approvalStatus",
    "revisionCausedBy",
    "rfpStatus",
    "projectClassification",
    "projectStatus"
  ],
  roleType: [
    {
      id: "admin",
      slug: "admin",
      name: "Admin"
    },
    {
      id: "internal",
      slug: "internal",
      name: "Internal"
    },
    {
      id: "doa",
      slug: "doa",
      name: "DOA"
    },
    {
      id: "poa",
      slug: "poa",
      name: "POA"
    }
  ],
  role: [
    {
      slug: "admin",
      abbr: "ADM",
      name: "Admin",
      role_type_ids: ["admin"]
    },
    {
      slug: "ceo",
      abbr: "CEO",
      name: "Chief Executive Officer",
      role_type_ids: ["internal"]
    },
    {
      slug: "de",
      abbr: "DE",
      name: "Design Engineer",
      role_type_ids: ["doa"]
    },
    {
      slug: "cvei",
      abbr: "CVEi",
      name: "Compliance verification engineer (Interior)",
      role_type_ids: ["doa"]
    },
    {
      slug: "cvea",
      abbr: "CVEa",
      name: "Compliance verification engineer (Avionic)",
      role_type_ids: ["doa"]
    },
    {
      slug: "cves",
      abbr: "CVEs",
      name: "Compliance verification engineer (Structure)",
      role_type_ids: ["doa"]
    },
    {
      slug: "cvef",
      abbr: "CVEf",
      name: "Compliance verification engineer (Flight)",
      role_type_ids: ["doa"]
    },
    {
      slug: "coa",
      abbr: "CoA",
      name: "Chief of the office of airworthiness",
      role_type_ids: ["doa"]
    },
    {
      slug: "hodo",
      abbr: "HoDo",
      name: "Head of design orgranizations Accountable Manager",
      role_type_ids: ["doa"]
    },
    {
      slug: "cim",
      abbr: "CIM",
      name: "Chief of the independent monitoring Quality Manager",
      role_type_ids: ["doa"]
    },
    {
      slug: "qm",
      abbr: "QM",
      name: "Quality Manager",
      role_type_ids: ["doa", "poa"]
    },
    {
      slug: "cs",
      abbr: "CS",
      name: "certifying staff",
      role_type_ids: ["poa"]
    },
    {
      slug: "pm",
      abbr: "PM",
      name: "production manager",
      role_type_ids: ["poa"]
    },
    {
      slug: "qa",
      abbr: "QA",
      name: "quality assurance",
      role_type_ids: ["poa"]
    },
    {
      slug: "sales",
      abbr: "Sales",
      name: "Sales Team",
      role_type_ids: ["internal"]
    }
  ],
  paymentTerms: [
    {
      slug: "immediate",
      code: "0/0/0",
      description: "immediate and in full"
    },
    {
      slug: "gta",
      code: "GTA",
      description: "in accordance with GTA"
    },
    {
      slug: "within_8_days_discount_3",
      code: "30/3/08",
      description: "within 8 days 3% discount, within 30 days due net"
    },
    {
      slug: "within_10_days_discount_3",
      code: "30/3/10",
      description: "within 10 days 3% discount, within 30 days due net"
    },
    {
      slug: "within_40_days_discount_2",
      code: "30/2/14",
      description: "within 40 days 2% discount, within 30 days due net"
    },
    {
      slug: "within_8_days",
      code: "08/0/0",
      description: "within 8 days due net"
    },
    {
      slug: "within_14_days",
      code: "14/0/0",
      description: "within 14 days due net"
    },
    {
      slug: "within_15_days",
      code: "15/0/0",
      description: "within 15 days due net"
    },
    {
      slug: "within_30_days",
      code: "30/0/0",
      description: "within 30 days due net"
    },
    {
      slug: "within_45_days",
      code: "45/0/0",
      description: "within 45 days due net"
    },
    {
      slug: "within_60_days",
      code: "60/0/0",
      description: "within 60 days due net"
    },
    {
      slug: "within_90_days",
      code: "90/0/0",
      description: "within 90 days due net"
    }
  ],
  deliveryTerm: [
    {
      slug: "EXW",
      code: "EXW",
      description: "Ab Werk lt. Incoterms 2010"
    },
    {
      slug: "FCA",
      code: "FCA",
      description: "frei Frachtführer lt. Incoterms 2010"
    },
    {
      slug: "CPT",
      code: "CPT",
      description: "Frachtfrei lt. Incoterms 2010"
    },
    {
      slug: "CIP",
      code: "CIP",
      description: "Frachtfrei versichert lt. Incoterms 2010"
    },
    {
      slug: "DAP",
      code: "DAP",
      description: "geliefert benannter Ort"
    },
    {
      slug: "DAT",
      code: "DAT",
      description: "geliefert Grenze lt. Incoterms 2010"
    },
    {
      slug: "DDP",
      code: "DDP",
      description: "geliefert verzollt lt. Incoterms 2010"
    },
    {
      slug: "FAS",
      code: "FAS",
      description: "frei Längsseite Seeschiff lt. Incoterms 2010"
    },
    {
      slug: "FOB",
      code: "FOB",
      description: "frei an Board lt. Incoterms 2010"
    },
    {
      slug: "CFR",
      code: "CFR",
      description: "Kosten und Fracht lt. Incoterms 2010"
    },
    {
      slug: "CIF",
      code: "CIF",
      description: "Kosten, Versicherung und Fracht lt. Incoterms 2010"
    }
  ],
  qms: [
    {
      slug: "EASA",
      id: "1",
      value: "EASA Part 21"
    },
    {
      slug: "EN_9100",
      id: "2",
      value: "EN 9100"
    },
    {
      slug: "ISO_9001",
      id: "3",
      value: "ISO 9001"
    }
  ],
  sex: [
    {
      slug: "male",
      id: "1",
      value: "Male"
    },
    {
      slug: "female",
      id: "2",
      value: "Female"
    },
    {
      slug: "non-binary",
      id: "3",
      value: "non-binary"
    }
  ],
  approvalStatus: [
    {
      slug: "created",
      id: "1",
      value: "Created"
    },
    {
      slug: "in_progress",
      id: "2",
      value: "In progress"
    },
    {
      slug: "in_release",
      id: "3",
      value: "In release"
    },
    {
      slug: "approved",
      id: "4",
      value: "Approved"
    },
    {
      slug: "released",
      id: "5",
      value: "Released"
    },
    {
      slug: "in_revision",
      id: "6",
      value: "In revision (valid)"
    },
    {
      slug: "revised",
      id: "7",
      value: "Revised"
    }
  ],
  revisionCausedBy: [
    {
      slug: "skytec",
      id: "1",
      value: "SkyTec"
    },
    {
      slug: "customer",
      id: "2",
      value: "Customer"
    },
    {
      slug: "design_subcontractor",
      id: "3",
      value: "Design Subcontractor"
    },
    {
      slug: "supplier",
      id: "4",
      value: "Supplier"
    },
    {
      slug: "agency_authority",
      id: "5",
      value: "Agency / Authority"
    }
  ],
  rfpStatus: [
    {
      slug: "rfp_created",
      id: "1",
      value: "RFP created"
    },
    {
      slug: "rejected",
      id: "2",
      value: "Rejected"
    },
    {
      slug: "in_progress",
      id: "3",
      value: "In progress"
    },
    {
      slug: "in_release",
      id: "4",
      value: "In release"
    },
    {
      slug: "proposal_released",
      id: "5",
      value: "Proposal released"
    },
    {
      slug: "accepted",
      id: "6",
      value: "Accepted"
    }
  ],
  projectClassification: [
    {
      slug: "minor_change",
      id: "1",
      value: "minor change"
    },
    {
      slug: "major_change",
      id: "2",
      value: "major change (STC)"
    },
    {
      slug: "minor_repair",
      id: "3",
      value: "minor repair"
    },
    {
      slug: "major_repair",
      id: "4",
      value: "major repair"
    },
    {
      slug: "consulting_services",
      id: "5",
      value: "consulting services (N/A)"
    }
  ],
  projectStatus: [
    {
      slug: "project_no_created",
      id: "1",
      value: "project no. created"
    },
    {
      slug: "proposal_in_progress",
      id: "2",
      value: "proposal in progress"
    },
    {
      slug: "waiting_for_order",
      id: "3",
      value: "waiting for order"
    },
    {
      slug: "active",
      id: "4",
      value: "active"
    },
    {
      slug: "cancelled",
      id: "5",
      value: "cancelled"
    },
    {
      slug: "closed",
      id: "6",
      value: "closed"
    }
  ]
};
