const { TYPE, FIELD_TYPE, FRONTEND_PAGE_TYPE, FILTER_TYPE } = require("./constants")
// Things for Run this generator


// DB Things

const CONFIG = {
    BASE_URL: "BASE_URL",
    PORT: 5000,
    UPLOAD_DIR: "upload",
    // SSL_CERT: { key: fs.readFileSync('./sslcert/privkey.pem', 'utf8'), cert: fs.readFileSync('./sslcert/fullchain.pem', 'utf8') },
    // HTTPS_PORT: 5001,
    DATABASE: {
        URL: "mongodb://localhost:27017/onest"
    },
    KEYS: {
        JWT_SECRET: "a1=Dn}%F/k/@Z`v^von]sr_3",
        SALT_ROUNDS: 10,
        SALT: "s5//P8$$ctLD"
    },
    DEFAULT_VALUES: {
        DEFAULT_PASSWORD: "123456789"
    }
}



const HelperMethods = {
    // formatDate: (date) => {
    //     // date = new Date(1579174808117)
    //     var dd = date.getDate();
    //     var mm = date.getMonth() + 1;
    //     var yyyy = date.getFullYear();
    //     if (dd < 10) { dd = '0' + dd }
    //     if (mm < 10) { mm = '0' + mm }
    //     date = dd + '-' + mm + '-' + yyyy;
    //     return date
    // }
}

const WEB_ROLES = {
    ONEST_SUPER_ADMIN: "ONEST_SUPER_ADMIN",
    ONEST_ADMIN: "ONEST_ADMIN",
    ORG_SUPER_ADMIN: "ORG_SUPER_ADMIN",
    ORG_ADMIN: "ORG_ADMIN",
    USER: "USER",
}


const DB_SCHEMAS = {
    DB_ONEST_MEMBER: "onest_members",
    DB_ORG: "orgs",
    DB_ORG_MEMBER: "org_members",
    DB_PRODUCTS: "products",
    DB_PRODUCT_ITEMS: "product_items",
    DB_USERS: "users",
    DB_REPORTS: "reports",
    DB_ITEM_EVENTS: "item_events",
}



const Onest_Members_Component = {
    name: 'onest_members',

    frontEnd: {
        pageName: "Member",
        pages: [FRONTEND_PAGE_TYPE.ADD_FORM, FRONTEND_PAGE_TYPE.ALL_TABLE],
        allTable: {
            apiUrl: "/onest_members",
            tableColumns: [
                {
                    title: "No.",
                    dataIndex: "no",
                },
                {
                    title: "Name",
                    dataIndex: "firstName",
                    render: (d, r) => `${r.firstName} ${r.middleName} ${r.lastName}`
                },
                {
                    title: "Email",
                    dataIndex: "email",
                    $GG_filter: {
                        filterType: FILTER_TYPE.SEARCH,
                    }
                },
                {
                    title: "Phone",
                    dataIndex: "phone",
                },
                {
                    title: "Role",
                    dataIndex: "role",
                    $GG_filter: {
                        filterType: FILTER_TYPE.DROPDOWN,
                        options: [{ value: WEB_ROLES.ONEST_ADMIN, label: "Admin" }, { value: WEB_ROLES.ONEST_SUPER_ADMIN, label: "Super Admin" }]
                    }
                },
                {
                    title: "Status",
                    dataIndex: "isActive",
                }
            ]
        }
    },
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_ONEST_MEMBER,
    // updatableBy: [WEB_ROLES.SUPER_ADMIN],

    login: {
        methods: {
            form: { //Form,Google,Facebook
                fields: [
                    { dbKey: "email", label: "Email", required: true },
                    { dbKey: "password", label: "Password", required: true, bcryptCompare: true }
                ],

            },
        },
        changePassword: {
            oldPassword: true,
            passwordField: { dbKey: "password", label: "Password", required: true }
        },
        forgotPassword: {
            methods: {
                emailVerification: {
                    fields: [ //Fields that will be shown in forgot password page
                        { dbKey: "email", label: "Email", required: true }
                    ],
                    emailField: "email", //Email field to send email
                    passwordField: { dbKey: "password", label: "Password", required: true } //Password Field that should change
                }
            }
        }
    },
    dbSchema: {
        firstName: { type: String, $GG_required: true },
        middleName: { type: String, $GG_visible_add: false, $GG_visible_edit: false, $GG_required: true },
        lastName: { type: String, $GG_required: true },
        email: { type: String, $GG_fieldType: FIELD_TYPE.EMAIL, $GG_required: true, $GG_editable: { add: true, edit: false }, $GG_unique: true },
        password: { type: String, $GG_fieldType: FIELD_TYPE.PASSWORD, $GG_required: { add: true, edit: false }, default: CONFIG.DEFAULT_VALUES.DEFAULT_PASSWORD, $GG_bcrypt: { salt: CONFIG.KEYS.SALT, saltRounds: CONFIG.KEYS.SALT_ROUNDS } },
        phone: { type: String, $GG_unique: true, $GG_required: { add: true, edit: false } },
        role: { type: String, $GG_required: true, $GG_fieldType: FIELD_TYPE.DROPDOWN, $GG_dropdown_options: [{ value: WEB_ROLES.ONEST_ADMIN, label: "Admin" }, { value: WEB_ROLES.ONEST_SUPER_ADMIN, label: "Super Admin" }] },
        isActive: { type: Boolean, $GG_FIELD_LABEL: "Status", default: true, $GG_fieldType: FIELD_TYPE.SWITCH },
    }
}

const org_component = {
    name: 'orgs',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_ORG,
    dbSchema: {
        email: { type: String, required: true },
        phone: { type: String, required: true },
        emailToken: String,
        status: String,
        isActive: { type: Boolean, default: true },
        address: String,
        countryCode: String,
        orgName: String,
        registrationNumber: String,
        incorporationCertificate: String,
        addressProof: String,
        exportLicense: String,
        approveBy: { type: "ObjectId", ref: DB_SCHEMAS.DB_ONEST_MEMBER }
    }
}


const orgMembers = {
    name: 'orgMembers',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_ORG_MEMBER,

    login: {
        methods: {
            form: { //Form,Google,Facebook
                fields: [
                    { dbKey: "email", label: "Email", required: true },
                    { dbKey: "password", label: "Password", required: true, bcryptCompare: true }
                ],

            },
        },
        changePassword: {
            oldPassword: true,
            passwordField: { dbKey: "password", label: "Password", required: true }
        },
        forgotPassword: {
            methods: {
                emailVerification: {
                    fields: [ //Fields that will be shown in forgot password page
                        { dbKey: "email", label: "Email", required: true }
                    ],
                    emailField: "email", //Email field to send email
                    passwordField: { dbKey: "password", label: "Password", required: true } //Password Field that should change
                }
            }
        }
    },
    dbSchema: {
        orgId: { type: "ObjectId", ref: DB_SCHEMAS.DB_ORG },
        firstName: String,
        middleName: String,
        lastName: String,
        email: { type: String, $GG_fieldType: FIELD_TYPE.EMAIL, $GG_required: true },
        password: { type: String, $GG_fieldType: FIELD_TYPE.PASSWORD, $GG_required: true, default: CONFIG.DEFAULT_VALUES.DEFAULT_PASSWORD, $GG_bcrypt: { salt: CONFIG.KEYS.SALT, saltRounds: CONFIG.KEYS.SALT_ROUNDS } },
        isActive: { type: Boolean, default: true },
        phone: String,
        role: String,

    }
}


const usersComponent = {
    name: 'users',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_USERS,
    dbSchema: {

        email: { type: String, $GG_fieldType: FIELD_TYPE.EMAIL, $GG_required: true },
        password: { type: String, $GG_fieldType: FIELD_TYPE.PASSWORD, $GG_required: true, default: CONFIG.DEFAULT_VALUES.DEFAULT_PASSWORD, $GG_bcrypt: { salt: CONFIG.KEYS.SALT, saltRounds: CONFIG.KEYS.SALT_ROUNDS } },
        emailToken: String,
        phone: String,
        firebaseId: String,
        countryCode: String,
        username: String,
        firstName: String,
        middleName: String,
        lastName: String,
        dob: String,
        address: String,
        scanCount: { type: Number, default: 0 },
        images: { type: String, valueType: FIELD_TYPE.IMAGE },
    }
}

const productComponent = {
    name: 'products',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_PRODUCTS,
    dbSchema: {
        brand: String,
        name: String,
        type: String,
        images: [String],
        certificates: [{ name: String, path: String }],
        attributes: "any",
        orgId: { type: "ObjectId", ref: DB_SCHEMAS.DB_ORG },

    }
}

const productItemComponent = {
    name: 'productItems',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_PRODUCT_ITEMS,
    dbSchema: {
        orgId: { type: "ObjectId", ref: DB_SCHEMAS.DB_ORG },
        productId: { type: "ObjectId", ref: DB_SCHEMAS.DB_PRODUCTS },
        lotNo: String,
        items: [{ guid: String, verificationUrl: String, scannedNo: String, status: String, soldTo: String, soldLocation: String, soldToUserId: { type: "ObjectId", ref: DB_SCHEMAS.DB_USERS }, qrCode: String }],
        expiryDate: String,
        dataOfMFG: String,

    }
}

const itemEvents = {
    name: 'itemEvents',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_ITEM_EVENTS,
    dbSchema: {
        productItemId: { type: "ObjectId", ref: DB_SCHEMAS.DB_PRODUCT_ITEMS },
        guid: String,
        eventType: String,
        userId: String,
        orgId: String,
        status: String,
        hash: String,
        location: String,
        blockchain_tran_id: String,
        ipAddress: String

    }
}




const reportsComponent = {
    name: 'reports',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_REPORTS,
    dbSchema: {
        productItemId: { type: "ObjectId", ref: DB_SCHEMAS.DB_PRODUCT_ITEMS },
        userId: { type: "ObjectId", ref: DB_SCHEMAS.DB_USERS },
        username: String,
        email: String,
        productName: String,
        storeName: String,
        storeAddress: String,
        storeCity: String,
        storeCountry: String,
        qrCodeData: String,
    }
}




module.exports = {
    // components: [orgPlans, employeeComponent, userComponent, groupComponent, orgAttendanceComponent],
    components: [Onest_Members_Component, org_component, orgMembers, usersComponent, reportsComponent, productComponent, productItemComponent, itemEvents],
    WEB_ROLES: WEB_ROLES,
    helpers: HelperMethods,
    configs: CONFIG,
    DB_SCHEMAS
}