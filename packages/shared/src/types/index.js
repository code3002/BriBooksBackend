"use strict";
// Common Types and Interfaces
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModerationStatus = exports.NotificationType = exports.PaymentStatus = exports.AgeGroup = exports.BookStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["AUTHOR"] = "AUTHOR";
    UserRole["READER"] = "READER";
    UserRole["MODERATOR"] = "MODERATOR";
})(UserRole || (exports.UserRole = UserRole = {}));
var BookStatus;
(function (BookStatus) {
    BookStatus["DRAFT"] = "DRAFT";
    BookStatus["PUBLISHED"] = "PUBLISHED";
    BookStatus["ARCHIVED"] = "ARCHIVED";
    BookStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(BookStatus || (exports.BookStatus = BookStatus = {}));
var AgeGroup;
(function (AgeGroup) {
    AgeGroup["TODDLER"] = "TODDLER";
    AgeGroup["PRESCHOOL"] = "PRESCHOOL";
    AgeGroup["EARLY_READER"] = "EARLY_READER";
    AgeGroup["MIDDLE_GRADE"] = "MIDDLE_GRADE";
    AgeGroup["YOUNG_ADULT"] = "YOUNG_ADULT"; // 13+ years
})(AgeGroup || (exports.AgeGroup = AgeGroup = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "EMAIL";
    NotificationType["IN_APP"] = "IN_APP";
    NotificationType["PUSH"] = "PUSH";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var ContentModerationStatus;
(function (ContentModerationStatus) {
    ContentModerationStatus["PENDING"] = "PENDING";
    ContentModerationStatus["APPROVED"] = "APPROVED";
    ContentModerationStatus["REJECTED"] = "REJECTED";
    ContentModerationStatus["FLAGGED"] = "FLAGGED";
})(ContentModerationStatus || (exports.ContentModerationStatus = ContentModerationStatus = {}));
//# sourceMappingURL=index.js.map