'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMG_MARKETING = exports.diyBypassedOrgs = exports.myInstituteDefaultColor = exports.orgAppColors = exports.ILLEGAL_COLLATION_CODE = exports.AUTH_USER = exports.buildType = exports.defaultSubSectionIconUrl = exports.conversationTypes = exports.userProfileTabs = exports.userProfileInfoSectionsSubSections = exports.userProfileInfoSections = exports.templateIdMap = exports.CONFIG = exports.AUTH_TUTOR_MIDDLEWARE = exports.AUTH_TOKEN = exports.userTypeMap = exports.byPassNumbers = exports.redisStoreName = exports.forbiddenNumbers = void 0;
const nationalities_1 = require("./constants/nationalities");
const bloodGroups_1 = require("./constants/bloodGroups");
const errorMessages_1 = require("./constants/errorMessages");
exports.forbiddenNumbers = [
    '919179786141',
    '919713189020',
    '917229935935',
    '918750219727',
    '919784714479',
    '919907465488',
    '919893889052',
    '917903750270',
    '917688852536'
];
exports.redisStoreName = {
    userDetails: {
        env: 'USER_DETAILS',
        redis: 'userDetails'
    }
};
exports.byPassNumbers = ['918130866039'];
exports.userTypeMap = {
    student: 1,
    parent: 2,
    tutor: 3,
    guest: 0,
    faculty: 4
};
exports.AUTH_TOKEN = {
    TOKEN_VERIFIED: errorMessages_1.TOKEN_VERIFIED,
    TOKEN_MISSING_400: errorMessages_1.TOKEN_MISSING_400,
    TOKEN_EXPIRED_400: errorMessages_1.TOKEN_EXPIRED_400,
    TOKEN_ERROR_400: errorMessages_1.TOKEN_ERROR_400,
    TOKEN_INVALID_401: errorMessages_1.TOKEN_INVALID_401,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    BAD_CLIENT_MISSING_USER_400: errorMessages_1.BAD_CLIENT_MISSING_USER_400,
    BAD_CLIENT_MISSING_CLIENT_400: errorMessages_1.BAD_CLIENT_MISSING_CLIENT_400,
    BAD_MALFORMED_SYNTAX: errorMessages_1.BAD_MALFORMED_SYNTAX,
    ACCOUNT_NOT_FOUND: errorMessages_1.ACCOUNT_NOT_FOUND,
    FORBIDDEN_ACCESS: errorMessages_1.FORBIDDEN_ACCESS
};
exports.AUTH_TUTOR_MIDDLEWARE = {
    BAD_CLIENT_MISSING_USER_400: errorMessages_1.BAD_CLIENT_MISSING_USER_400,
    BAD_CLIENT_MISSING_TUTOR_ID_400: errorMessages_1.BAD_CLIENT_MISSING_TUTOR_ID_400,
    ACCESS_403_TUTORS_ONLY: errorMessages_1.ACCESS_403_TUTORS_ONLY,
    ACCESS_403_PREMIUM_TUTORS_ONLY: errorMessages_1.ACCESS_403_PREMIUM_TUTORS_ONLY,
    BAD_INTERNAL_500: errorMessages_1.BAD_INTERNAL_500,
    BAD_INVALID_CARETAKER_400: errorMessages_1.BAD_INVALID_CARETAKER_400
};
exports.CONFIG = {
    PUBLIC_KEY_URL: 'https://api4.truecaller.com/v1/key'
};
exports.templateIdMap = {
    lite_invite_student_to_batch_02: '1707161106424059400',
    lite_student_signup_01: '1707161829766970050',
    lite_invite_student_01: '1707161217198615051',
    lite_student_signup_reminder_01: '1707161175346691982',
    lite_landing_page_signup_tutor_01: '1707161829825718252',
    lite_student_signup_reminder_02: '1707161226115076445',
    lite_homework_assigned_02: '1707161848830184688',
    lite_fees_reminder: '1707161777349089622',
    lite_fees_transaction_modified: '1707161777497701463',
    lite_fees_payment_reminder: '1707161777349089622',
    lite_fees_transaction_created: '1707161777473055902',
    lite_fees_transaction_processed_tutor: '1707161777524608523',
    lite_fees_transaction_processed_student: '1707161777515902941',
    lite_new_study_material_01: '1707161898622174202',
    lite_new_study_material_02: '1707161898614460142'
};
exports.userProfileInfoSections = {
    1: [
        {
            sectionId: 1,
            sectionName: errorMessages_1.BASIC_INFO,
            order: 1,
            isEditable: 0,
            isVisible: 1,
            default: 1
        },
        {
            sectionId: 3,
            sectionName: errorMessages_1.PERSONAL_DETAILS,
            order: 2,
            isEditable: 0,
            isVisible: 1,
            default: 0
        },
        {
            sectionId: 4,
            sectionName: errorMessages_1.ADDRESS,
            order: 3,
            isEditable: 0,
            isVisible: 1,
            default: 0
        },
        {
            sectionId: 5,
            sectionName: errorMessages_1.EDUCATIONAL_DETAILS,
            order: 4,
            isEditable: 0,
            isVisible: 1,
            default: 0
        }
    ]
};
exports.userProfileInfoSectionsSubSections = {
    1: {
        1: [
            {
                subSectionId: 1,
                sectionId: 1,
                label: errorMessages_1.NAME,
                key: 'name',
                order: 1,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/name.png',
                isValueEditable: 1,
                default: 1,
                isVisible: 1,
                isMandatory: 1
            },
            {
                subSectionId: 2,
                sectionId: 1,
                label: errorMessages_1.MOBILE_NUMBER,
                key: 'mobile_number',
                order: 2,
                type: 'MOBILE',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/number.png',
                isValueEditable: 0,
                default: 1,
                isVisible: 1,
                isMandatory: 1
            },
            {
                subSectionId: 3,
                sectionId: 1,
                label: errorMessages_1.EMAIL,
                key: 'email',
                order: 3,
                type: 'EMAIL',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/mail.png',
                isValueEditable: 0,
                default: 1,
                isVisible: 1,
                isMandatory: 1
            },
            {
                subSectionId: 4,
                sectionId: 1,
                label: errorMessages_1.ABOUT,
                key: 'about',
                order: 4,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/info.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 5,
                sectionId: 1,
                label: errorMessages_1.ROLL_NO,
                key: 'roll_number',
                order: 5,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/number.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 6,
                sectionId: 1,
                label: errorMessages_1.DOJ,
                key: 'date_of_joining',
                order: 6,
                type: 'DATE',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/calendar.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            }
        ],
        3: [
            {
                subSectionId: 1,
                sectionId: 3,
                label: errorMessages_1.DOB,
                key: 'date_of_birth',
                order: 1,
                type: 'DATE',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/DOB.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 2,
                sectionId: 3,
                label: errorMessages_1.GENDER,
                key: 'gender',
                order: 2,
                type: 'RADIO',
                options: [
                    {
                        id: 1,
                        value: `Male`,
                        label: `Male`
                    },
                    {
                        id: 2,
                        value: `Female`,
                        label: `Female`
                    }
                ],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/gender.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 3,
                sectionId: 3,
                label: errorMessages_1.NATIONALITY,
                key: 'nationality',
                order: 3,
                type: 'DROPDOWN',
                options: nationalities_1.default,
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/nationality.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 4,
                sectionId: 3,
                label: errorMessages_1.BLOOD_GROUP,
                key: 'blood_group',
                order: 4,
                type: 'DROPDOWN',
                options: bloodGroups_1.default,
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/bllodgroup.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 5,
                sectionId: 3,
                label: errorMessages_1.AADHAR_NO,
                key: 'aadhar_number',
                order: 5,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/file.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 6,
                sectionId: 3,
                label: errorMessages_1.AADHAR_CARD_IMG,
                key: 'aadhar_card_image',
                order: 6,
                type: 'DOCUMENT_UPLOAD',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/upload.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 7,
                sectionId: 3,
                label: errorMessages_1.PAN_NO,
                key: 'pan_number',
                order: 7,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/file.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 8,
                sectionId: 3,
                label: errorMessages_1.PAN_CARD_IMG,
                key: 'pan_card_image',
                order: 8,
                type: 'DOCUMENT_UPLOAD',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/upload.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 9,
                sectionId: 3,
                label: errorMessages_1.SIGNATURE,
                key: 'signature',
                order: 9,
                type: 'DOCUMENT_UPLOAD',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/file.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            }
        ],
        4: [
            {
                subSectionId: 1,
                sectionId: 4,
                label: errorMessages_1.PERMANENT_ADDRESS,
                key: 'permanent_address',
                order: 1,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/address.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 2,
                sectionId: 4,
                label: errorMessages_1.PERMANENT_PINCODE,
                key: 'permanent_address_pin_code',
                order: 2,
                type: 'NUMBER',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/pincode.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 3,
                sectionId: 4,
                label: errorMessages_1.CORRESPONDENCE_ADDRESS,
                key: 'correspondence_address',
                order: 3,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/address.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 4,
                sectionId: 4,
                label: errorMessages_1.CORRESPONDENCE_PINCODE,
                key: 'correspondence_address_pin_code',
                order: 4,
                type: 'NUMBER',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/pincode.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            }
        ],
        5: [
            {
                subSectionId: 1,
                sectionId: 5,
                label: errorMessages_1.COLLEGE_NAME,
                key: 'college_university_name',
                order: 1,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/College.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 2,
                sectionId: 5,
                label: errorMessages_1.COLLEGE_MARKS,
                key: 'marks_in_college',
                order: 2,
                type: 'PERCENT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/marks.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 3,
                sectionId: 5,
                label: errorMessages_1.COLLEGE_RESULT,
                key: 'upload_college_result',
                order: 3,
                type: 'DOCUMENT_UPLOAD',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/upload.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 4,
                sectionId: 5,
                label: errorMessages_1.SCHOOL_NAME,
                key: 'school_name',
                order: 4,
                type: 'TEXT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/SchoolName.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 5,
                sectionId: 5,
                label: errorMessages_1.XII_MARKS,
                key: 'marks_in_xii',
                order: 4,
                type: 'PERCENT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/marks.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 6,
                sectionId: 5,
                label: errorMessages_1.XII_RESULT,
                key: 'upload_xii_result',
                order: 4,
                type: 'DOCUMENT_UPLOAD',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/upload.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 7,
                sectionId: 5,
                label: errorMessages_1.X_MARKS,
                key: 'marks_in_x',
                order: 4,
                type: 'PERCENT',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/marks.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            },
            {
                subSectionId: 8,
                sectionId: 5,
                label: errorMessages_1.X_RESULT,
                key: 'upload_x_result',
                order: 4,
                type: 'DOCUMENT_UPLOAD',
                options: [],
                isEditable: 0,
                iconUrl: 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/upload.png',
                isValueEditable: 1,
                default: 0,
                isVisible: 1,
                isMandatory: 0
            }
        ]
    }
};
exports.userProfileTabs = {
    1: [
        {
            tabName: errorMessages_1.INFO,
            tabCategory: 1,
            order: 1,
            premiumTutorOnly: 0,
            filters: [],
            subTabs: []
        },
        {
            tabName: errorMessages_1.BATCHES,
            tabCategory: 2,
            order: 2,
            premiumTutorOnly: 0,
            filters: [],
            subTabs: [],
            weEventName: 'Profile_BatchTab Click'
        },
        {
            tabName: errorMessages_1.COURSES,
            tabCategory: 3,
            order: 3,
            premiumTutorOnly: 1,
            filters: [],
            subTabs: [],
            weEventName: 'Profile_CoursesTab Click'
        },
        {
            tabName: errorMessages_1.PERFORMANCE,
            tabCategory: 4,
            order: 4,
            premiumTutorOnly: 0,
            filters: [],
            subTabs: [
                {
                    id: 1,
                    name: errorMessages_1.BATCH_TESTS,
                    premiumTutorOnly: 0,
                    filters: [
                        {
                            id: 1,
                            name: errorMessages_1.BATCHES,
                            key: 'batchIdColl',
                            isStudentVisible: 0,
                            premiumTutorOnly: 0
                        },
                        {
                            id: 2,
                            name: errorMessages_1.TEST_TYPE,
                            key: 'testType',
                            isStudentVisible: 1,
                            premiumTutorOnly: 0
                        },
                        {
                            id: 3,
                            name: errorMessages_1.DATE_RANGE,
                            key: 'dateRange',
                            isStudentVisible: 1,
                            premiumTutorOnly: 0
                        }
                    ],
                    weEventName: 'Profile_Performance Batch'
                },
                {
                    id: 2,
                    name: errorMessages_1.COURSE_TESTS,
                    premiumTutorOnly: 1,
                    filters: [
                        {
                            id: 1,
                            name: errorMessages_1.COURSES,
                            key: 'courses',
                            isStudentVisible: 1,
                            premiumTutorOnly: 1
                        },
                        {
                            id: 2,
                            name: errorMessages_1.DATE_RANGE,
                            key: 'dateRange',
                            isStudentVisible: 1,
                            premiumTutorOnly: 0
                        }
                    ],
                    weEventName: 'Profile_Performance Course'
                }
            ]
        },
        {
            tabName: errorMessages_1.PAYMENTS,
            tabCategory: 5,
            order: 5,
            premiumTutorOnly: 1,
            filters: [],
            subTabs: [],
            weEventName: 'Profile_PaymentTab Click'
        },
        {
            tabName: errorMessages_1.ASSIGNMENTS,
            tabCategory: 6,
            order: 6,
            premiumTutorOnly: 0,
            filters: [
                {
                    id: 1,
                    name: errorMessages_1.BATCHES,
                    key: 'batchIdColl',
                    isStudentVisible: 0,
                    premiumTutorOnly: 0
                },
                {
                    id: 2,
                    name: errorMessages_1.DATE_RANGE,
                    key: 'dateRange',
                    isStudentVisible: 1,
                    premiumTutorOnly: 0
                }
            ],
            subTabs: [],
            weEventName: 'Profile_AssignmentTab Click'
        }
    ],
    2: [
        {
            tabName: errorMessages_1.INFO,
            tabCategory: 1,
            order: 1,
            premiumTutorOnly: 0,
            filters: [],
            subTabs: []
        }
    ],
    3: [
        {
            tabName: errorMessages_1.INFO,
            tabCategory: 1,
            order: 1,
            premiumTutorOnly: 0,
            filters: [],
            subTabs: []
        }
    ]
};
exports.conversationTypes = {
    oneToOne: 1,
    group: 2,
    broadcast: 3
};
exports.defaultSubSectionIconUrl = 'https://res.cloudinary.com/classplus/image/upload/v1577096529/whitelabel/studentProfile/customise.png';
exports.buildType = {
    MANUAL: 1,
    AUTOMATED: 2
};
exports.AUTH_USER = {
    BLOCKED_USER_ID: errorMessages_1.BLOCKED_USER_ID
};
exports.ILLEGAL_COLLATION_CODE = 1267;
exports.orgAppColors = {
    default: '009ae0',
    blue: '009ae0',
    red: 'FD3D39',
    orange: 'FE9526',
    green: '53D86A',
    purple: '595BD4',
    pink: 'FD3259',
    rust: 'E6632F',
    yellow: 'ffd000',
    '#009ae0': '009ae0',
    '#fd3d39': 'FD3D39',
    '#fe9526': 'FE9526',
    '#53d86a': '53D86A',
    '#595bd4': '595BD4',
    '#fd3259': 'FD3259',
    '#e6632f': 'E6632F',
    '#ffd000': 'ffd000'
};
exports.myInstituteDefaultColor = 'FD3D39';
exports.diyBypassedOrgs = [170];
exports.IMG_MARKETING = 'https://res.cloudinary.com/dmnjztlw5/image/upload/v1573822168/Dashboard_creative_10.09_1_mjgzud.jpg';
//# sourceMappingURL=constant.js.map