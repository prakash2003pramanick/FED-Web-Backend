const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const memberController = require("./../../controllers/members/membersController");
const auth = require("./../../middleware/validator");

// Public || Get All Mebers Data
router.get("/", memberController.showMembers);

// auth
router.use(auth);

// Private || Add Member
router.post(
  "/addMember",
  [
    check("name", "name is Required").not().isEmpty(),
    check("access", "access is Required").not().isEmpty(),
    check("email", "email is Required").not().isEmpty(),
    check("img", "img is Required").not().isEmpty(),
  ],

  memberController.addMembers
);

router.post("/delMember", memberController.delMembers);

router.post(
  "/addAlumni",
  [check("email", "email is required").not().isEmpty()],
  memberController.addAlumni
);

module.exports = router;