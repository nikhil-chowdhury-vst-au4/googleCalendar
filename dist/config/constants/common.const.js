"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOS_MC = exports.paymentGateway = exports.currency = exports.PRIVACY_POLICY_URL = exports.FILTER_ERR = exports.platformsType = exports.CAMPAIGN_GOAL_TYPES = exports.SKIP_ANDROID_VERSION = exports.typesToCareTakerMapping = exports.caretakerTypes = exports.studentKycDefaultCatSubCat = exports.inValidTabsProperties = exports.internalOrgs = exports.userAgent = void 0;
const errorMessages_1 = require("./errorMessages");
exports.userAgent = {
    ANDROID: 'Mobile-Android',
    IOS: 'Mobile - iOS',
    WEB: 'WEB'
};
exports.internalOrgs = [
    13, 19, 29, 43, 60, 135, 141, 146, 174, 177, 188, 195, 293, 322, 346, 396,
    401, 464, 508, 566, 604, 624, 629, 656, 671, 685, 688, 691, 698, 707, 710,
    717, 732, 760, 808, 823, 827, 828, 844, 913, 937, 1099, 1104, 1113, 1118,
    1152, 1179, 1192, 1220, 1221, 1239, 1254, 1263, 1283, 1286, 1294, 1336,
    1414, 1418, 1431, 1491, 1523, 1533, 1542, 1545, 1547, 1557, 1566, 1589,
    1621, 1636, 1638, 1650, 1674, 1676, 1707, 1729, 1758, 1814, 1821, 1825,
    1853, 1876, 1879, 1890, 1903, 1920, 2048, 2102, 2109, 2113, 2125, 2176,
    2185, 2209, 2266, 2269, 2308, 2319, 2328, 2341, 2356, 2364, 2371, 2378,
    2408, 2432, 2440, 2468, 2471, 2482, 2500, 2538, 2565, 2572, 2601, 2652,
    2653, 2656, 2701, 2702, 2726, 2793, 2892, 2970, 2999, 3026, 3042, 3067,
    3078, 3080, 3148, 3167, 3169, 3170, 3212, 3242, 3243, 3251, 3304, 3319,
    3348, 3441, 3460, 3471, 3495, 3553, 3567, 3658, 3695, 3768, 3823, 3870,
    3936, 3970, 4064, 4100, 4111, 4163, 4175, 4194, 4195, 4293, 4300, 4330,
    4344, 4369, 4375, 4391, 4400, 4402, 4408, 4496, 4515, 4626, 4632, 4639,
    4669, 4674, 4714, 4726, 4788, 4799, 4800, 4825, 4846, 4856, 4867, 4907,
    4908, 5023, 5034, 5051, 5071, 5177, 5192, 5202, 5204, 5227, 5255, 5265,
    5343, 5372, 5407, 5423, 5466, 5470, 5498, 5553, 5554, 5595, 5637, 5641,
    5650, 5653, 5657, 5696, 5712, 5716, 5723, 5731, 5747, 5769, 5825, 5845,
    5872, 5925, 5965, 5973, 6009, 6018, 6096, 6131, 6154, 6160, 6183, 6253,
    6266, 6293, 6295, 6325, 6329, 6345, 6365, 6397, 6438, 6449, 6455, 6489,
    6558, 6581, 6596, 6605, 6616, 6639, 6642, 6685, 6701, 6708, 6724, 6812,
    6816, 6879, 6883, 6987, 7027, 7074, 7137, 7237, 7285, 7340, 7342, 7375,
    7405, 7428, 7430, 7433, 7443, 7448, 7451, 7459, 7535, 7538, 7546, 7562,
    7564, 7607, 7673, 7695, 7729, 7792, 7800, 7807, 7808, 7829, 7907, 7947,
    7977, 8004, 8016, 8118, 8119, 8122, 8157, 8171, 8182, 8203, 8205, 8210,
    8254, 8268, 8286, 8292, 8305, 8306, 8309, 8336, 8341, 8366, 8367, 8378,
    8439, 8440, 8448, 8467, 8501, 8526, 8585, 8636, 8649, 8654, 8678, 8704,
    8708, 8717, 8735, 8743, 8781, 8788, 8795, 8797, 8810, 8821, 8837, 8841,
    8844, 8870, 8908, 8914, 8917, 8968, 9062, 9093, 9097, 9102, 9132, 9142,
    9157, 9169, 9180, 9189, 9214, 9296, 9299, 9309, 9319, 9331, 9347, 9378,
    9384, 9390, 9392, 9408, 9520, 9536, 9571, 9592, 9601, 9655, 9670, 9699,
    9742, 9748, 9760, 9808, 9814, 9821, 9880, 9920, 9924, 9960, 9964, 9974,
    9985, 9995, 10013, 10041, 10064, 10067, 10079, 10103, 10113, 10118, 10132,
    10151, 10160, 10174, 10220, 10257, 10283, 10289, 10320, 10336, 10338, 10363,
    10467, 10515, 10521, 10537, 10541, 10546, 10553, 10688, 10689, 10702, 10732,
    10782, 10800, 10815, 10847, 10856, 10857, 10867, 10876, 10896, 10905, 10906,
    10987, 11003, 11024, 11038, 11050, 11060, 11073, 11088, 11144, 11164, 11175,
    11209, 11212, 11213, 11228, 11246, 11289, 11291, 11292, 11300, 11303, 11308,
    11327, 11332, 11335, 11337, 11363, 11377, 11379, 11409, 11445, 11461, 11479,
    11492, 11494, 11509, 11516, 11522, 11531, 11543, 11549, 11577, 11596, 11604,
    11617, 11620, 11637, 11638, 11653, 11684, 11723, 11735, 11761, 11777, 11778,
    11780, 11781, 11790, 11800, 11816, 11817, 11825, 11826, 11827, 11834, 11838,
    11843, 11849, 11879, 11885, 11924, 11928, 11932, 11940, 11941, 11958, 11975,
    11981, 11996, 12015, 12050, 12061, 12072, 12098, 12139, 12141, 12173, 12176,
    12235, 12249, 12295, 12304, 12322, 12327, 12428, 12431, 12458, 12512, 12543,
    12569, 12624, 12642, 12644, 12645, 12699, 12702, 12735, 12748, 12750, 12772,
    12776, 12783, 12811, 12850, 12884, 12886, 12900, 12907, 12910, 12954, 12971,
    12984, 13002, 13014, 13047, 13081, 13083, 13098, 13143, 13162, 13165, 13175,
    13192, 13238, 13246, 13267, 13303, 13305, 13372, 13378, 13381, 13421, 13432,
    13440, 13454, 13555, 13562, 13575, 13581, 13583, 13587, 13625, 13631, 13640,
    13714, 13755, 13783, 13812, 13825, 13850, 13851, 13862, 13881, 13928, 13936,
    13944, 13950, 13966, 13972, 13992, 14038, 14050, 14077, 14089, 14102, 14229,
    15222, 43184, 43979, 43999, 44316, 44344, 46022, 47717, 49211, 49222, 49231,
    49243, 50473, 50483, 50489, 50514, 50535, 51654, 51661, 51674, 52565, 52590,
    53657, 53684, 54855, 54864, 56049, 56108, 57093, 57098, 57918, 57937, 57947,
    57962, 57963, 57968, 57970, 58652, 58676, 58701, 58702, 58712, 59415, 59418,
    60149, 60150, 60176, 60180, 60193, 60195, 60202, 60824, 60832, 60841, 60845,
    60846, 61523, 61530, 61535, 61554, 61572, 61573, 61576, 61577, 62314, 62330,
    63079, 63752, 63755, 63786, 64404, 64419, 65142, 65144, 65172, 65752, 65755,
    65767, 65801, 65807, 65809, 66329, 66361, 66362, 66363, 66364, 66365, 66377,
    66380, 66885, 66917, 66926, 66932, 66934, 67528, 67569, 68120, 68161, 68627,
    76381, 76419, 76721, 76762, 77092, 77316, 77641, 78136, 78700, 78756, 82359,
    82441, 82454, 82507, 99164, 99322, 100348, 100358, 102702, 102716, 102758,
    102763, 102809, 103346, 103483, 103711, 103723, 104145, 104460, 104689,
    104734, 107370, 107479, 112069, 112070, 112081, 112108, 112110, 112162,
    112164, 112284, 112622, 112728, 113353, 113557, 113564, 113621, 113790,
    113848, 121021, 121030, 121659, 122762, 122798, 127803, 127812, 127837,
    127938, 128032, 128038, 128077, 128129, 128136, 147669, 147720, 150352,
    150380, 150423, 150690, 279648, 279694, 279802, 281917, 281993, 282904,
    283661, 283680, 283730, 283832, 284599, 285913, 287914, 288048, 94247
];
exports.inValidTabsProperties = [
    'id',
    'orgId',
    'userType',
    'screen',
    'createdAt',
    'updatedAt'
];
exports.studentKycDefaultCatSubCat = {
    1: 6,
    2: 16,
    3: 23,
    4: 35,
    5: 42
};
exports.caretakerTypes = {
    PAYMENTS: 1,
    ENQUIRY: 2,
    NOTIFICATIONS: 3,
    COUPONS: 4,
    CHATS: 5,
    BANNERS: 6
};
exports.typesToCareTakerMapping = {
    3: { type: 'notifications', displayText: 'Notifications' },
    4: { type: 'couponCodes', displayText: 'Coupon Codes' },
    5: { type: 'chats', displayText: 'Chats' }
};
exports.SKIP_ANDROID_VERSION = '1.4.23';
exports.CAMPAIGN_GOAL_TYPES = {
    COURSES: 1,
    COUPONS: 2,
    REVENUE: 3,
    APP_DOWNLOADS: 4,
    NOTIFICATIONS: 5,
    TRANSACTIONS: 6,
    LIVE_CLASSES: 7,
    VIDEOS: 8
};
exports.platformsType = {
    android: 1,
    ios: 2,
    web: 3
};
exports.FILTER_ERR = {
    MESSAGE: errorMessages_1.FILTER_ERROR,
    CODE: 420
};
exports.PRIVACY_POLICY_URL = 'https://privacy-policy.courses.store';
exports.currency = {
    INR: 1,
    SGD: 2,
    AED: 3
};
exports.paymentGateway = {
    RZP: 1,
    TZP: 2
};
exports.IOS_MC = 'IOS-MC';
//# sourceMappingURL=common.const.js.map