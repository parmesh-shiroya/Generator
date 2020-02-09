// Things for Run this generator
let TYPE = {
    COMPONENT: "COMPONENT"
}

let VALUE_TYPE = {
    EMAIL: "EMAIL",
    PASSWORD: "PASSWORD",
    IMAGE: "IMAGE"
}



// DB Things

const CONFIG = {
    BASE_URL: "BASE_URL",
    PORT: 5000,
    UPLOAD_DIR: "upload",
    // SSL_CERT: { key: fs.readFileSync('./sslcert/privkey.pem', 'utf8'), cert: fs.readFileSync('./sslcert/fullchain.pem', 'utf8') },
    // HTTPS_PORT: 5001,
    DATABASE: {
        URL: "mongodb://localhost:27017/celebx"
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
    formatDate: (date) => {
        // date = new Date(1579174808117)
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        date = dd + '-' + mm + '-' + yyyy;
        return date
    }
}

const WEB_ROLES = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    MEMBER: "Member",
    SELF: "SELF",
}


const DB_SCHEMAS = {
    DB_ORGANIZATIONS: "organisations",
    DB_CAMERAS: "cameras",
    DB_EMPLOYEES: "employees",
    DB_RECENT_ACTIVITIES: "recent_activities",
    DB_GROUPS: "groups",
    DB_COURSES: "courses",
    DB_STUDENT: "students",
    DB_STUDENT_ATTENDANCE: "student_attendances",
    DB_SESSION: "sessions",
    DB_BATCH: "batchs",
    DB_VISITOR: "visitors",
    DB_VENDOR: "vendors",
    DB_USER: "users",
    DB_ROOM: "rooms",
    DB_SECTION: "sections",
    DB_ORG_ATTENDANCE: "org_attendances",
}


const orgComponent = {
    name: 'org',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_ORGANIZATIONS,
    updatableBy: [WEB_ROLES.SUPER_ADMIN],
    dbSchema: {
        logo: { type: String, required: true, valueType: VALUE_TYPE.IMAGE },
        name: { type: String, required: true },
        email: { type: String, required: true, valueType: VALUE_TYPE.EMAIL },
        mobileNo: { type: String, required: true },
        website: String,
        billingEmail: String,
        billingMobile: String,
        status: { type: Boolean, default: true, updatableBy: [] },
        address: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        // vat: String,
        // type: String,
        // subType: String
    }
}

const employeeComponent = {
    name: 'employee',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_EMPLOYEES,
    addableBy: [WEB_ROLES.ADMIN, WEB_ROLES.SUPER_ADMIN],
    updatableBy: [WEB_ROLES.ADMIN, WEB_ROLES.SUPER_ADMIN, WEB_ROLES.SELF],
    jwtSecret: CONFIG.KEYS.JWT_SECRET,
    login: {
        methods: {
            form: { //Form,Google,Facebook
                fields: [
                    { dbKey: "email", label: "Email", required: true },
                    { dbKey: "password", label: "Password", required: true }
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
        orgId: { type: "ObjectId", ref: DB_SCHEMAS.DB_ORGANIZATIONS, updatableBy: [] },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, valueType: VALUE_TYPE.EMAIL, required: true },
        password: { type: String, valueType: VALUE_TYPE.PASSWORD, required: true, default: CONFIG.DEFAULT_VALUES.DEFAULT_PASSWORD, bcrypt: { salt: CONFIG.KEYS.SALT, saltRounds: CONFIG.KEYS.SALT_ROUNDS } },
        mobileNo: { required: true, type: String, updatableBy: [WEB_ROLES.SUPER_ADMIN, WEB_ROLES.ADMIN] },
        role: String,
        groupId: [{ type: "ObjectId", ref: DB_SCHEMAS.DB_GROUPS, labelKey: "name" }],
        gender: String,
        dob: String,
        empNo: String,
        lastLogin: Date,
        joinDate: String,
        webRole: { type: String, default: WEB_ROLES.MEMBER, oneOf: [WEB_ROLES.SUPER_ADMIN, WEB_ROLES.ADMIN, WEB_ROLES.MEMBER] },
        images: [{ type: String, valueType: VALUE_TYPE.IMAGE }],
        status: { type: Boolean, default: true, updatableBy: [WEB_ROLES.SUPER_ADMIN, WEB_ROLES.ADMIN] },
        addedBy: { type: "ObjectId", ref: DB_SCHEMAS.DB_EMPLOYEES },
        groupAdmin: [{ type: "ObjectId", ref: DB_SCHEMAS.DB_GROUPS }]
    }
}

const groupComponent = {
    name: 'group',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_GROUPS,
    addableBy: [WEB_ROLES.ADMIN, WEB_ROLES.SUPER_ADMIN],
    updatableBy: [WEB_ROLES.ADMIN, WEB_ROLES.SUPER_ADMIN],
    dbSchema: {
        orgId: { type: "ObjectId", ref: DB_SCHEMAS.DB_ORGANIZATIONS },
        name: String,
        description: String
    }
}

const orgAttendanceComponent = {
    name: 'org_attendance',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_ORG_ATTENDANCE,
    addableBy: [WEB_ROLES.ADMIN, WEB_ROLES.SUPER_ADMIN],
    updatableBy: [WEB_ROLES.ADMIN, WEB_ROLES.SUPER_ADMIN],
    extraImport: {
        model: {
            helpers: [HelperMethods.formatDate]
        }
    },
    dbSchema: {
        orgId: { type: "ObjectId", ref: DB_SCHEMAS.DB_ORGANIZATIONS },
        userId: { type: "ObjectId", ref: DB_SCHEMAS.DB_USER },
        checkInTime: Number,
        checkOutTime: Number,
        checkInGate: String,
        checkOutGate: String,
        date:
        {
            type: String,
            // default: () => {
            // return formatDate(new Date())
            // }
        },
        hours: Number,
        purpose: String
    }
}

const userComponent = {
    name: 'user',
    type: TYPE.COMPONENT,
    dbName: DB_SCHEMAS.DB_USER,
    dbSchema: {
        empId: [{ type: "ObjectId", ref: DB_SCHEMAS.DB_EMPLOYEES }],
        // visitorId: { type: "ObjectId", ref: DB_SCHEMAS.DB_VISITOR },
        // vendorId: { type: "ObjectId", ref: DB_SCHEMAS.DB_VENDOR },
        // studentId: { type: "ObjectId", ref: DB_SCHEMAS.DB_STUDENT },
        status: { type: Boolean, default: true }
    }
}


module.exports = {
    components: [orgComponent, employeeComponent, userComponent, groupComponent, orgAttendanceComponent],
    WEB_ROLES: WEB_ROLES,
    helpers: HelperMethods,
    configs: CONFIG
}