const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    console.log(req.query, "req.query");

    // Build the filter object dynamically based on the query parameters
    let filters = {};
    if (category.length > 0) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length > 0) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length > 0) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    // Handle the sorting based on the 'sortBy' query parameter
    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;
      case "price-hightolow":
        sortParam.pricing = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.pricing = 1;
        break;
    }

    // Fetch the courses based on the filters and sorting
    const coursesList = await Course.find(filters).sort(sortParam);

    // Send response with the courses list
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses!",
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching course details!",
    });
  }
};

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    
    // Find the student's courses
    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    if (!studentCourses) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this student",
      });
    }

    // Check if the student has already purchased the course
    const hasPurchasedCourse = studentCourses.courses.some(
      (course) => course.courseId === id
    );

    res.status(200).json({
      success: true,
      data: hasPurchasedCourse,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while checking course purchase status!",
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};
